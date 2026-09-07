import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants';
import type { IRoleRepository } from '../../../../domain/rbac/repositories/role.repository';

@Injectable()
export class GetRoleByIdUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(id: string) {
    const role = await this.roleRepo.findById(id);
    if (!role || role.deletedAt) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }

    return {
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
    };
  }
}
