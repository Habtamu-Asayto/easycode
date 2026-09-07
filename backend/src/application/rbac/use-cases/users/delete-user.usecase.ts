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
import type { IRefreshTokenRepository } from '../../../../domain/rbac/repositories/refresh-token.repository';

@Injectable()
export class DeleteUserUseCase {
  private readonly logger = new Logger(DeleteUserUseCase.name);

  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
    @Inject(REPOSITORY_TOKENS.REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepo: IRefreshTokenRepository,
  ) {}

  async execute(id: string, currentUserId: string) {
    if (id === currentUserId) {
      throw new BadRequestException('You cannot delete your own account');
    }

    const user = await this.userRepo.findById(id);
    if (!user || user.deletedAt) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    // Soft delete user (also cascades to user roles)
    await this.userRepo.softDelete(id, currentUserId);

    // Revoke all tokens
    await this.refreshTokenRepo.revokeAllUserTokens(id);

    // Audit
    await this.auditRepo.create({
      userId: currentUserId,
      action: AUDIT_ACTIONS.SOFT_DELETE,
      entity: 'User',
      entityId: id,
      oldValues: { email: user.email, username: user.username },
    });
  }
}
