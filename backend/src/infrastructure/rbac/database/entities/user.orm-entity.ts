/**
 * Prisma User model type mapping and response mapper.
 * Maps raw Prisma results to domain-friendly response objects.
 */
export class UserMapper {
  static toResponseDto(user: any) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || null,
      mobileNumber: user.mobileNumber || null,
      avatar: user.avatar || null,
      isActive: user.isActive,
      isLocked: user.isLocked,
      lastLoginAt: user.lastLoginAt,
      roles: user.userRoles
        ? user.userRoles
            .filter((ur: any) => !ur.deletedAt && ur.role && !ur.role.deletedAt)
            .map((ur: any) => ({
              id: ur.role.id,
              name: ur.role.name,
              displayName: ur.role.displayName,
            }))
        : [],
      region: user.region
        ? { id: user.region.id, name: user.region.name }
        : null,
      zone: user.zone ? { id: user.zone.id, name: user.zone.name } : null,
      woreda: user.woreda
        ? { id: user.woreda.id, name: user.woreda.name }
        : null,
      kebele: user.kebele
        ? { id: user.kebele.id, name: user.kebele.name }
        : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toResponseDtoList(users: any[]) {
    return users.map((u) => UserMapper.toResponseDto(u));
  }
}

/** Prisma include clause for user with roles and geography */
export const USER_INCLUDE = {
  userRoles: {
    where: { deletedAt: null },
    include: {
      role: {
        include: {
          rolePermissions: {
            where: { deletedAt: null },
            include: { permission: true },
          },
        },
      },
    },
  },
  region: { select: { id: true, name: true } },
  zone: { select: { id: true, name: true } },
  woreda: { select: { id: true, name: true } },
  kebele: { select: { id: true, name: true } },
} as const;
