import { Injectable, Inject, Logger } from '@nestjs/common';
import { REPOSITORY_TOKENS, AUDIT_ACTIONS } from '../../../../shared/constants';
import type { IRefreshTokenRepository } from '../../../../domain/rbac/repositories/refresh-token.repository';
import type { IAuditRepository } from '../../../../domain/rbac/repositories/audit.repository';

@Injectable()
export class LogoutUseCase {
  private readonly logger = new Logger(LogoutUseCase.name);

  constructor(
    @Inject(REPOSITORY_TOKENS.REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepo: IRefreshTokenRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.refreshTokenRepo.revokeToken(refreshToken);
    } else {
      await this.refreshTokenRepo.revokeAllUserTokens(userId);
    }

    await this.auditRepo.create({
      userId,
      action: AUDIT_ACTIONS.LOGOUT,
      entity: 'User',
      entityId: userId,
    });
  }
}
