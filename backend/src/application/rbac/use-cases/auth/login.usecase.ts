import {
  Injectable,
  Inject,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import {
  REPOSITORY_TOKENS,
  AUDIT_ACTIONS,
  RBAC_CONSTANTS,
} from '../../../../shared/constants';
import type { IUserRepository } from '../../../../domain/rbac/repositories/user.repository';
import type { IAuditRepository } from '../../../../domain/rbac/repositories/audit.repository';
import type { IRefreshTokenRepository } from '../../../../domain/rbac/repositories/refresh-token.repository';
import { LoginDto } from '../../dto';
import { PasswordUtil } from '../../../../shared/utils';

@Injectable()
export class LoginUseCase {
  private readonly logger = new Logger(LoginUseCase.name);

  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
    @Inject(REPOSITORY_TOKENS.REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepo: IRefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    // Find user by email, username, or mobile number
    let user = await this.userRepo.findByEmail(dto.username);
    if (!user) {
      user = await this.userRepo.findByUsername(dto.username);
    }
    if (!user && dto.username.match(/^(\+251|0)[0-9]{9}$/)) {
      user = (await this.userRepo.findByMobileNumber?.(dto.username)) ?? null;
    }

    if (!user) {
      await this.auditRepo.create({
        action: AUDIT_ACTIONS.LOGIN_FAILED,
        entity: 'User',
        newValues: { username: dto.username, reason: 'User not found' },
        ipAddress,
        userAgent,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Account is deactivated. Please contact an administrator.',
      );
    }

    if (user.isLocked) {
      throw new UnauthorizedException(
        'Account is locked due to too many failed login attempts. Please contact an administrator.',
      );
    }

    // Validate password
    const isPasswordValid = await PasswordUtil.compare(
      dto.password,
      user.password,
    );
    if (!isPasswordValid) {
      const failedAttempts = user.failedLoginAttempts + 1;
      const isLocked =
        failedAttempts >= RBAC_CONSTANTS.PASSWORD.MAX_FAILED_ATTEMPTS;

      await this.userRepo.update(user.id, {
        failedLoginAttempts: failedAttempts,
        isLocked,
      });

      await this.auditRepo.create({
        userId: user.id,
        action: AUDIT_ACTIONS.LOGIN_FAILED,
        entity: 'User',
        entityId: user.id,
        newValues: { reason: 'Invalid password', failedAttempts, isLocked },
        ipAddress,
        userAgent,
      });

      if (isLocked) {
        throw new UnauthorizedException(
          'Account has been locked due to too many failed login attempts.',
        );
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    // Extract roles and permissions
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

    // Generate tokens
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      roles,
      permissions: uniquePermissions,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = uuidv4();

    const refreshExpiration =
      this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d';
    const refreshExpiresAt = new Date();
    const days = parseInt(refreshExpiration.replace('d', ''));
    refreshExpiresAt.setDate(
      refreshExpiresAt.getDate() + (isNaN(days) ? 7 : days),
    );

    await this.refreshTokenRepo.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshExpiresAt,
      ipAddress,
      userAgent,
    });

    // Update login info
    await this.userRepo.update(user.id, {
      lastLoginAt: new Date(),
      failedLoginAttempts: 0,
    });

    await this.auditRepo.create({
      userId: user.id,
      action: AUDIT_ACTIONS.LOGIN,
      entity: 'User',
      entityId: user.id,
      ipAddress,
      userAgent,
    });

    return {
      accessToken,
      refreshToken,
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
