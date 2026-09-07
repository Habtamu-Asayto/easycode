import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { REPOSITORY_TOKENS, AUDIT_ACTIONS } from '../../../../shared/constants';
import type { IRoleRepository } from '../../../../domain/rbac/repositories/role.repository';
import type { IAuditRepository } from '../../../../domain/rbac/repositories/audit.repository';
import { RbacDomainService } from '../../../../domain/rbac/services';

@Injectable()
export class DeleteRoleUseCase {
  private readonly logger = new Logger(DeleteRoleUseCase.name);

  constructor(
    @Inject(REPOSITORY_TOKENS.ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(id: string, currentUserId: string) {
    const role = await this.roleRepo.findById(id);
    if (!role || role.deletedAt) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }

    if (role.isSystem || RbacDomainService.isSystemRole(role.name)) {
      throw new BadRequestException('System roles cannot be deleted');
    }

    await this.roleRepo.softDelete(id, currentUserId);

    await this.auditRepo.create({
      userId: currentUserId,
      action: AUDIT_ACTIONS.SOFT_DELETE,
      entity: 'Role',
      entityId: id,
      oldValues: { name: role.name, displayName: role.displayName },
    });
  }
}
