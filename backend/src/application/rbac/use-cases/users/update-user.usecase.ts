import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { REPOSITORY_TOKENS, AUDIT_ACTIONS } from '../../../../shared/constants';
import type { IUserRepository } from '../../../../domain/rbac/repositories/user.repository';
import type { IAuditRepository } from '../../../../domain/rbac/repositories/audit.repository';
import { UpdateUserDto } from '../../dto';

@Injectable()
export class UpdateUserUseCase {
  private readonly logger = new Logger(UpdateUserUseCase.name);

  constructor( 
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(id: string, dto: UpdateUserDto, currentUserId: string) {
    const existing = await this.userRepo.findById(id);
    if (!existing || existing.deletedAt) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    // Duplicate checks
    if (dto.email && dto.email !== existing.email) {
      const dup = await this.userRepo.findByEmail(dto.email);
      if (dup && dup.id !== id) {
        throw new ConflictException('A user with this email already exists');
      }
    }

    if (dto.username && dto.username !== existing.username) {
      const dup = await this.userRepo.findByUsername(dto.username);
      if (dup && dup.id !== id) {
        throw new ConflictException('A user with this username already exists');
      }
    }

    const oldValues = {
      email: existing.email,
      username: existing.username,
      firstName: existing.firstName,
      lastName: existing.lastName,
      phone: existing.phone,
      isActive: existing.isActive,
    };

    // Update user fields
    const { roleIds, ...userData } = dto;
    await this.userRepo.update(id, {
      ...userData,
      audit: { updatedBy: currentUserId },
    });

    // Reassign roles if provided
    if (roleIds !== undefined) {
      await this.userRepo.assignRoles(id, roleIds, currentUserId);
    }

    // Audit
    await this.auditRepo.create({
      userId: currentUserId,
      action: AUDIT_ACTIONS.UPDATE,
      entity: 'User',
      entityId: id,
      oldValues,
      newValues: dto,
    });

    return this.userRepo.findById(id);
  }
}
