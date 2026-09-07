import { Injectable, Inject, ConflictException, Logger } from '@nestjs/common';
import { REPOSITORY_TOKENS, AUDIT_ACTIONS } from '../../../../shared/constants';
import type { IRoleRepository } from '../../../../domain/rbac/repositories/role.repository';
import type { IAuditRepository } from '../../../../domain/rbac/repositories/audit.repository';
import { CreateRoleDto } from '../../dto';

@Injectable()
export class CreateRoleUseCase {
  private readonly logger = new Logger(CreateRoleUseCase.name);

  constructor(
    @Inject(REPOSITORY_TOKENS.ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(dto: CreateRoleDto, currentUserId: string) {
    const existing = await this.roleRepo.findByName(dto.name);
    if (existing) {
      throw new ConflictException(
        `A role with name "${dto.name}" already exists`,
      );
    }

    const role = await this.roleRepo.create({
      name: dto.name,
      displayName: dto.displayName,
      description: dto.description || null,
      isActive: dto.isActive,
      audit: { createdBy: currentUserId },
    });

    if (dto.permissionIds && dto.permissionIds.length > 0) {
      await this.roleRepo.assignPermissions(
        role.id,
        dto.permissionIds,
        currentUserId,
      );
    }

    await this.auditRepo.create({
      userId: currentUserId,
      action: AUDIT_ACTIONS.CREATE,
      entity: 'Role',
      entityId: role.id,
      newValues: {
        name: dto.name,
        displayName: dto.displayName,
        permissionIds: dto.permissionIds,
      },
    });

    return this.roleRepo.findById(role.id);
  }
}
