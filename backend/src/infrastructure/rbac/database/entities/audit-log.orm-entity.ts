/**
 * Prisma AuditLog model type mapping.
 */
export class AuditLogMapper {
  static toResponseDto(log: any) {
    return {
      id: log.id,
      userId: log.userId,
      userName: log.user ? `${log.user.firstName} ${log.user.lastName}` : null,
      userEmail: log.user?.email || null,
      action: log.action,
      entity: log.entity,
      entityId: log.entityId,
      oldValues: log.oldValues,
      newValues: log.newValues,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      createdAt: log.createdAt,
    };
  }
}
