import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { REPOSITORY_TOKENS, AUDIT_ACTIONS } from '../../../../shared/constants';
import type { IUserRepository } from '../../../../domain/rbac/repositories/user.repository';
import type { IAuditRepository } from '../../../../domain/rbac/repositories/audit.repository';

@Injectable()
export class UnlockUserUseCase {
  private readonly logger = new Logger(UnlockUserUseCase.name);

  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(userId: string, currentUserId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user || user.deletedAt) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    await this.userRepo.unlock(userId, currentUserId);

    await this.auditRepo.create({
      userId: currentUserId,
      action: AUDIT_ACTIONS.ACCOUNT_UNLOCKED,
      entity: 'User',
      entityId: userId,
    });

    return this.userRepo.findById(userId);
  }
}
