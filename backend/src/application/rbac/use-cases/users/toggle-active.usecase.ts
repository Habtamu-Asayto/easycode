import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { REPOSITORY_TOKENS, AUDIT_ACTIONS } from '../../../../shared/constants';
import type { IUserRepository } from '../../../../domain/rbac/repositories/user.repository';
import type { IAuditRepository } from '../../../../domain/rbac/repositories/audit.repository';

@Injectable()
export class ToggleActiveUseCase {
  private readonly logger = new Logger(ToggleActiveUseCase.name);

  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(userId: string, currentUserId: string) {
    if (userId === currentUserId) {
      throw new BadRequestException('You cannot deactivate your own account');
    }

    const user = await this.userRepo.findById(userId);
    if (!user || user.deletedAt) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    const newActiveState = !user.isActive;
    await this.userRepo.update(userId, {
      isActive: newActiveState,
      audit: { updatedBy: currentUserId },
    });

    await this.auditRepo.create({
      userId: currentUserId,
      action: newActiveState
        ? AUDIT_ACTIONS.ACCOUNT_ACTIVATED
        : AUDIT_ACTIONS.ACCOUNT_DEACTIVATED,
      entity: 'User',
      entityId: userId,
      oldValues: { isActive: user.isActive },
      newValues: { isActive: newActiveState },
    });

    return this.userRepo.findById(userId);
  }
}
