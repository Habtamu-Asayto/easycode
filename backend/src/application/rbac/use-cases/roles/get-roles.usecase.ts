import { Injectable, Inject } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants';
import type { IRoleRepository } from '../../../../domain/rbac/repositories/role.repository';
import { RoleQueryDto } from '../../dto';
import { PaginationUtil } from '../../../../shared/utils';

@Injectable()
export class GetRolesUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(query: RoleQueryDto) {
    const { roles, total } = await this.roleRepo.findAll(query);

    const items = roles.map((role) => ({
      id: role.id,
      name: role.name,
      displayName: role.displayName,
      description: role.description,
      isSystem: role.isSystem,
      isActive: role.isActive,
      permissions: role.rolePermissions
        ? role.rolePermissions
            .filter(
              (rp: any) =>
                !rp.deletedAt && rp.permission && !rp.permission.deletedAt,
            )
            .map((rp: any) => ({
              id: rp.permission.id,
              name: rp.permission.name,
              displayName: rp.permission.displayName,
              module: rp.permission.module,
              action: rp.permission.action,
            }))
        : [],
      userCount: role._count?.userRoles || 0,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    }));

    return {
      items,
      meta: PaginationUtil.buildMeta(query.page, query.limit, total),
    };
  }
}
