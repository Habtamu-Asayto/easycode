import {
  Injectable,
  Inject,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { REPOSITORY_TOKENS } from '../../../../shared/constants';
import type { IUserRepository } from '../../../../domain/rbac/repositories/user.repository';
import type { IRefreshTokenRepository } from '../../../../domain/rbac/repositories/refresh-token.repository';

@Injectable()
export class RefreshTokensUseCase {
  private readonly logger = new Logger(RefreshTokensUseCase.name);

  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(REPOSITORY_TOKENS.REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepo: IRefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(refreshToken: string, ipAddress?: string, userAgent?: string) {
    const storedToken = await this.refreshTokenRepo.findByToken(refreshToken);

    if (
      !storedToken ||
      storedToken.revokedAt ||
      new Date() > storedToken.expiresAt
    ) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userRepo.findById(storedToken.userId);
    if (!user || user.deletedAt || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Revoke old token
    await this.refreshTokenRepo.revokeToken(refreshToken);

    // Extract roles & permissions
    const roles: string[] = [];
    const permissions: string[] = [];
    if (user.userRoles) {
      for (const ur of user.userRoles) {
        if (
          !ur.deletedAt &&
          ur.role &&
          !ur.role.deletedAt &&
          ur.role.isActive
        ) {
          roles.push(ur.role.name);
          if (ur.role.rolePermissions) {
            for (const rp of ur.role.rolePermissions) {
              if (
                !rp.deletedAt &&
                rp.permission &&
                !rp.permission.deletedAt &&
                rp.permission.isActive
              ) {
                permissions.push(rp.permission.name);
              }
            }
          }
        }
      }
    }
    const uniquePermissions = [...new Set(permissions)];

    // Generate new tokens
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      roles,
      permissions: uniquePermissions,
    };
    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = uuidv4();

    const refreshExpiration =
      this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d';
    const refreshExpiresAt = new Date();
    const days = parseInt(refreshExpiration.replace('d', ''));
    refreshExpiresAt.setDate(
      refreshExpiresAt.getDate() + (isNaN(days) ? 7 : days),
    );

    await this.refreshTokenRepo.create({
      token: newRefreshToken,
      userId: user.id,
      expiresAt: refreshExpiresAt,
      ipAddress,
      userAgent,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        roles,
        permissions: uniquePermissions,
      },
    };
  }
}
