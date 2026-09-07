import { Injectable, Inject } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants';
import type { IPermissionRepository } from '../../../../domain/rbac/repositories/permission.repository';
import { GroupedPermissions } from '../../../../domain/rbac/entities';

@Injectable()
export class GetGroupedPermissionsUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.PERMISSION_REPOSITORY)
    private readonly permissionRepo: IPermissionRepository,
  ) {}

  async execute(): Promise<GroupedPermissions> {
    const permissions = await this.permissionRepo.findAllActive();
    const grouped: GroupedPermissions = {};

    for (const p of permissions) {
      if (!grouped[p.module]) {
        grouped[p.module] = [];
      }
      grouped[p.module].push({
        id: p.id,
        name: p.name,
        displayName: p.displayName,
        description: p.description,
        module: p.module,
        action: p.action,
        isActive: p.isActive,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      });
    }

    return grouped;
  }
}
