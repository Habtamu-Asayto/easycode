import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { REPOSITORY_TOKENS, AUDIT_ACTIONS } from '../../../../shared/constants';
import type { IUserRepository } from '../../../../domain/rbac/repositories/user.repository';
import type { IAuditRepository } from '../../../../domain/rbac/repositories/audit.repository';
import type { IRefreshTokenRepository } from '../../../../domain/rbac/repositories/refresh-token.repository';
import { ResetPasswordDto } from '../../dto';
import { PasswordUtil } from '../../../../shared/utils';

@Injectable()
export class ResetPasswordUseCase {
  private readonly logger = new Logger(ResetPasswordUseCase.name);

  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
    @Inject(REPOSITORY_TOKENS.REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepo: IRefreshTokenRepository,
  ) {}

  async execute(
    userId: string,
    dto: ResetPasswordDto,
    currentUserId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const user = await this.userRepo.findById(userId);
    if (!user || user.deletedAt) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    const hashedPassword = await PasswordUtil.hash(dto.newPassword);
    await this.userRepo.update(userId, {
      password: hashedPassword,
      passwordChangedAt: new Date(),
    });

    // Revoke all tokens
    await this.refreshTokenRepo.revokeAllUserTokens(userId);

    await this.auditRepo.create({
      userId: currentUserId,
      action: AUDIT_ACTIONS.PASSWORD_RESET,
      entity: 'User',
      entityId: userId,
      ipAddress,
      userAgent,
    });
  }
}
