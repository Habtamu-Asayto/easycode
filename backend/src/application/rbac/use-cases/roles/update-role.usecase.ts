import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { REPOSITORY_TOKENS, AUDIT_ACTIONS } from '../../../../shared/constants';
import type { IRoleRepository } from '../../../../domain/rbac/repositories/role.repository';
import type { IAuditRepository } from '../../../../domain/rbac/repositories/audit.repository';
import { UpdateRoleDto } from '../../dto';
import { RbacDomainService } from '../../../../domain/rbac/services';

@Injectable()
export class UpdateRoleUseCase {
  private readonly logger = new Logger(UpdateRoleUseCase.name);

  constructor(
    @Inject(REPOSITORY_TOKENS.ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(id: string, dto: UpdateRoleDto, currentUserId: string) {
    const existing = await this.roleRepo.findById(id);
    if (!existing || existing.deletedAt) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }

    if (existing.isSystem && RbacDomainService.isSystemRole(existing.name)) {
      throw new BadRequestException('System roles cannot be modified');
    }

    const oldValues = {
      displayName: existing.displayName,
      description: existing.description,
      isActive: existing.isActive,
    };

    const { permissionIds, ...roleData } = dto;
    await this.roleRepo.update(id, {
      ...roleData,
      audit: { updatedBy: currentUserId },
    });

    if (permissionIds !== undefined) {
      await this.roleRepo.assignPermissions(id, permissionIds, currentUserId);
    }

    await this.auditRepo.create({
      userId: currentUserId,
      action: AUDIT_ACTIONS.UPDATE,
      entity: 'Role',
      entityId: id,
      oldValues,
      newValues: dto,
    });

    return this.roleRepo.findById(id);
  }
}
