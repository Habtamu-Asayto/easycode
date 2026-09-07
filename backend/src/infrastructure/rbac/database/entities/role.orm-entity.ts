/**
 * Prisma Role model type mapping and response mapper.
 */
export class RoleMapper {
  static toResponseDto(role: any) {
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

  static toResponseDtoList(roles: any[]) {
    return roles.map((r) => RoleMapper.toResponseDto(r));
  }
}

/** Prisma include clause for role with permissions */
export const ROLE_INCLUDE = {
  rolePermissions: {
    where: { deletedAt: null },
    include: {
      permission: true,
    },
  },
  _count: {
    select: {
      userRoles: { where: { deletedAt: null } },
    },
  },
} as const;
