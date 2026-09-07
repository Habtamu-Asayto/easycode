/**
 * Prisma Permission model type mapping and response mapper.
 */
export class PermissionMapper {
  static toResponseDto(permission: any) {
    return {
      id: permission.id,
      name: permission.name,
      displayName: permission.displayName,
      description: permission.description,
      module: permission.module,
      action: permission.action,
      isActive: permission.isActive,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }

  static toResponseDtoList(permissions: any[]) {
    return permissions.map((p) => PermissionMapper.toResponseDto(p));
  }

  static groupByModule(permissions: any[]) {
    const grouped: Record<string, any[]> = {};
    for (const p of permissions) {
      if (!grouped[p.module]) {
        grouped[p.module] = [];
      }
      grouped[p.module].push(PermissionMapper.toResponseDto(p));
    }
    return grouped;
  }
}
