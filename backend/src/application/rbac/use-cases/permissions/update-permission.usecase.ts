import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { REPOSITORY_TOKENS, AUDIT_ACTIONS } from '../../../../shared/constants';
import type { IPermissionRepository } from '../../../../domain/rbac/repositories/permission.repository';
import type { IAuditRepository } from '../../../../domain/rbac/repositories/audit.repository';
import { UpdatePermissionDto } from '../../dto';

@Injectable()
export class UpdatePermissionUseCase {
  private readonly logger = new Logger(UpdatePermissionUseCase.name);

  constructor(
    @Inject(REPOSITORY_TOKENS.PERMISSION_REPOSITORY)
    private readonly permissionRepo: IPermissionRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(id: string, dto: UpdatePermissionDto, currentUserId: string) {
    const existing = await this.permissionRepo.findById(id);
    if (!existing || existing.deletedAt) {
      throw new NotFoundException(`Permission with ID "${id}" not found`);
    }

    const oldValues = {
      displayName: existing.displayName,
      description: existing.description,
      isActive: existing.isActive,
    };

    await this.permissionRepo.update(id, {
      ...dto,
      audit: { updatedBy: currentUserId },
    });

    await this.auditRepo.create({
      userId: currentUserId,
      action: AUDIT_ACTIONS.UPDATE,
      entity: 'Permission',
      entityId: id,
      oldValues,
      newValues: dto,
    });

    return this.permissionRepo.findById(id);
  }
}
