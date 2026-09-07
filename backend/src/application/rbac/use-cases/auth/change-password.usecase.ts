import {
  Injectable,
  Inject,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { REPOSITORY_TOKENS, AUDIT_ACTIONS } from '../../../../shared/constants';
import type { IUserRepository } from '../../../../domain/rbac/repositories/user.repository';
import type { IRefreshTokenRepository } from '../../../../domain/rbac/repositories/refresh-token.repository';
import type { IAuditRepository } from '../../../../domain/rbac/repositories/audit.repository';
import { ChangePasswordDto } from '../../dto';
import { PasswordUtil } from '../../../../shared/utils';

@Injectable()
export class ChangePasswordUseCase {
  private readonly logger = new Logger(ChangePasswordUseCase.name);

  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(REPOSITORY_TOKENS.REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepo: IRefreshTokenRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(
    userId: string,
    dto: ChangePasswordDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const user = await this.userRepo.findById(userId);
    if (!user || user.deletedAt) {
      throw new BadRequestException('User not found');
    }

    const isCurrentPasswordValid = await PasswordUtil.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await PasswordUtil.hash(dto.newPassword);

    await this.userRepo.update(userId, {
      password: hashedPassword,
      passwordChangedAt: new Date(),
    });

    // Revoke all refresh tokens on password change
    await this.refreshTokenRepo.revokeAllUserTokens(userId);

    await this.auditRepo.create({
      userId,
      action: AUDIT_ACTIONS.PASSWORD_CHANGE,
      entity: 'User',
      entityId: userId,
      ipAddress,
      userAgent,
    });
  }
}
