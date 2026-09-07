import { Injectable, Inject, ConflictException, Logger } from '@nestjs/common';
import { REPOSITORY_TOKENS, AUDIT_ACTIONS } from '../../../../shared/constants';
import type { IPermissionRepository } from '../../../../domain/rbac/repositories/permission.repository';
import type { IAuditRepository } from '../../../../domain/rbac/repositories/audit.repository';
import { CreatePermissionDto } from '../../dto';
import { StringUtil } from '../../../../shared/utils';

@Injectable()
export class CreatePermissionUseCase {
  private readonly logger = new Logger(CreatePermissionUseCase.name);

  constructor(
    @Inject(REPOSITORY_TOKENS.PERMISSION_REPOSITORY)
    private readonly permissionRepo: IPermissionRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(dto: CreatePermissionDto, currentUserId: string) {
    const name = StringUtil.generatePermissionName(dto.module, dto.action);

    const existing = await this.permissionRepo.findByModuleAction(
      dto.module,
      dto.action,
    );
    if (existing) {
      throw new ConflictException(
        `A permission for "${dto.module}:${dto.action}" already exists`,
      );
    }

    const permission = await this.permissionRepo.create({
      name,
      displayName: dto.displayName,
      description: dto.description || null,
      module: dto.module,
      action: dto.action,
      isActive: dto.isActive,
      audit: { createdBy: currentUserId },
    });

    await this.auditRepo.create({
      userId: currentUserId,
      action: AUDIT_ACTIONS.CREATE,
      entity: 'Permission',
      entityId: permission.id,
      newValues: { name, module: dto.module, action: dto.action },
    });

    return permission;
  }
}
