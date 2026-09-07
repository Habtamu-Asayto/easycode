import { HealthController } from './health.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { DatabaseModule } from './infrastructure/rbac/database/database.module';
import { RbacModule } from './presentation/rbac/rbac.module';
import { GeographyModule } from './presentation/geography/geography.module'; 
import { JwtAuthGuard } from './presentation/rbac/guards';
import { RolesGuard } from './presentation/rbac/guards';
import { PermissionsGuard } from './presentation/rbac/guards';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL || '60000'),
        limit: parseInt(process.env.THROTTLE_LIMIT || '100'),
      },
    ]),
    DatabaseModule,
    RbacModule,
    GeographyModule, 
  ],
  controllers:[HealthController],
  providers: [
    // Global JWT auth guard - all routes require auth by default
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global roles guard
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // Global permissions guard
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    // Rate limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

