import { Injectable, Inject, ConflictException, Logger } from '@nestjs/common';
import { REPOSITORY_TOKENS, AUDIT_ACTIONS } from '../../../../shared/constants';
import type { IUserRepository } from '../../../../domain/rbac/repositories/user.repository';
import type { IAuditRepository } from '../../../../domain/rbac/repositories/audit.repository';
import { CreateUserDto } from '../../dto';
import { PasswordUtil } from '../../../../shared/utils';

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);

  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(dto: CreateUserDto, currentUserId: string) {
    // Check for duplicates
    const existingByEmail = await this.userRepo.findByEmail(dto.email);
    if (existingByEmail) {
      throw new ConflictException('A user with this email already exists');
    }

    const existingByUsername = await this.userRepo.findByUsername(dto.username);
    if (existingByUsername) {
      throw new ConflictException('A user with this username already exists');
    }

    // Hash password
    const hashedPassword = await PasswordUtil.hash(dto.password);

    // Create user
    const user = await this.userRepo.create({
      email: dto.email,
      username: dto.username,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone || null,
      mobileNumber: dto.mobileNumber || null,
      isActive: dto.isActive,
      regionId: dto.regionId || null,
      zoneId: dto.zoneId || null,
      woredaId: dto.woredaId || null,
      kebeleId: dto.kebeleId || null,
      audit: { createdBy: currentUserId },
    });

    // Assign roles
    if (dto.roleIds && dto.roleIds.length > 0) {
      await this.userRepo.assignRoles(user.id, dto.roleIds, currentUserId);
    }

    // Audit log
    await this.auditRepo.create({
      userId: currentUserId,
      action: AUDIT_ACTIONS.CREATE,
      entity: 'User',
      entityId: user.id,
      newValues: {
        email: dto.email,
        username: dto.username,
        firstName: dto.firstName,
        lastName: dto.lastName,
        roleIds: dto.roleIds,
      },
    });

    // Return fresh user with roles
    return this.userRepo.findById(user.id);
  }
}
