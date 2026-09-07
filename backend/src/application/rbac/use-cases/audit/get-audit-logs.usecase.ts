import { Injectable, Inject } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants'; 
import type { IAuditRepository } from '../../../../domain/rbac/repositories/audit.repository';
import { AuditQueryDto } from '../../dto';
import { PaginationUtil } from '../../../../shared/utils';

@Injectable()
export class GetAuditLogsUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(query: AuditQueryDto) {
    const { logs, total, page, limit } = await this.auditRepo.findAll(query);

    const items = logs.map((log: any) => ({
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
    }));

    return {
      items,
      meta: PaginationUtil.buildMeta(page, limit, total),
    };
  }
}
