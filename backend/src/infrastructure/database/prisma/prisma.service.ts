import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';
import pg from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private static instance: PrismaService;
  private pool: pg.Pool;

  constructor(private readonly configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL')!;
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.pool = pool;
    if (PrismaService.instance) return PrismaService.instance;
    PrismaService.instance = this;
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connection established');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
    this.logger.log('Database connection closed');
  }

  softDeleteFilter() {
    return { deletedAt: null };
  }

  auditCreate(userId?: string) {
    return { createdBy: userId || null, updatedBy: userId || null };
  }

  auditUpdate(userId?: string) {
    return { updatedBy: userId || null };
  }

  softDelete() {
    return { deletedAt: new Date() };
  }
}
