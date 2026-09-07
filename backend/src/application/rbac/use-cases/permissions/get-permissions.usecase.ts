import { Injectable, Inject } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants';
import type { IPermissionRepository } from '../../../../domain/rbac/repositories/permission.repository';
import { PermissionQueryDto } from '../../dto';
import { PaginationUtil } from '../../../../shared/utils';

@Injectable()
export class GetPermissionsUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.PERMISSION_REPOSITORY)
    private readonly permissionRepo: IPermissionRepository,
  ) {}

  async execute(query: PermissionQueryDto) {
    const { permissions, total } = await this.permissionRepo.findAll(query);

    const items = permissions.map((p) => ({
      id: p.id,
      name: p.name,
      displayName: p.displayName,
      description: p.description,
      module: p.module,
      action: p.action,
      isActive: p.isActive,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return {
      items,
      meta: PaginationUtil.buildMeta(query.page, query.limit, total),
    };
  }
}
