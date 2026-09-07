import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { REPOSITORY_TOKENS, AUDIT_ACTIONS } from '../../../../shared/constants';
import type { IPermissionRepository } from '../../../../domain/rbac/repositories/permission.repository';
import type { IAuditRepository } from '../../../../domain/rbac/repositories/audit.repository';

@Injectable()
export class DeletePermissionUseCase {
  private readonly logger = new Logger(DeletePermissionUseCase.name);

  constructor(
    @Inject(REPOSITORY_TOKENS.PERMISSION_REPOSITORY)
    private readonly permissionRepo: IPermissionRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(id: string, currentUserId: string) {
    const permission = await this.permissionRepo.findById(id);
    if (!permission || permission.deletedAt) {
      throw new NotFoundException(`Permission with ID "${id}" not found`);
    }

    await this.permissionRepo.softDelete(id, currentUserId);

    await this.auditRepo.create({
      userId: currentUserId,
      action: AUDIT_ACTIONS.SOFT_DELETE,
      entity: 'Permission',
      entityId: id,
      oldValues: {
        name: permission.name,
        module: permission.module,
        action: permission.action,
      },
    });
  }
}
