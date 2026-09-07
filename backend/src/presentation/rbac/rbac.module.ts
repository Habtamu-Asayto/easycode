import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Controllers
import {
  AuthController,
  UserController,
  RoleController,
  PermissionController, 
  AuditController,
} from './controllers';

// Providers
import {
  repositoryProviders,
  useCaseProviders,
} from './providers/rbac.providers';

// Strategy
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallback-secret',
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRATION') ||
            '15m') as any,
        },
      }),
    }),
  ],
  controllers: [
    AuthController,
    UserController,
    RoleController,
    PermissionController,
    AuditController,
  ],
  providers: [...repositoryProviders, ...useCaseProviders, JwtStrategy],
  exports: [JwtModule, ...repositoryProviders],
})
export class RbacModule {}
