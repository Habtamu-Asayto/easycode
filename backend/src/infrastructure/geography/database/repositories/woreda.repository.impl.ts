import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../database/prisma/prisma.service';
import { IWoredaRepository } from '../../../../domain/geography/repositories/woreda.repository';
import { WOREDA_INCLUDE } from '../entities';
import { PaginationUtil } from '../../../../shared/utils';

@Injectable()
export class PrismaWoredaRepository implements IWoredaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    isActive?: boolean;
    zoneId?: string;
  }) {
    const where: any = { ...this.prisma.softDeleteFilter() };
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.isActive !== undefined) where.isActive = query.isActive;
    if (query.zoneId) where.zoneId = query.zoneId;

    const skip = PaginationUtil.calculateSkip(query.page, query.limit);
    const [items, total] = await Promise.all([
      this.prisma.woreda.findMany({
        where,
        include: WOREDA_INCLUDE,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit,
      }),
      this.prisma.woreda.count({ where }),
    ]);
    return { items, total };
  }

  async findById(id: string) {
    return this.prisma.woreda.findFirst({
      where: { id, ...this.prisma.softDeleteFilter() },
      include: WOREDA_INCLUDE,
    });
  }

  async findByZone(zoneId: string) {
    return this.prisma.woreda.findMany({
      where: { zoneId, isActive: true, ...this.prisma.softDeleteFilter() },
      include: WOREDA_INCLUDE,
      orderBy: { name: 'asc' },
    });
  }

  async create(data: any, userId?: string) {
    return this.prisma.woreda.create({
      data: { ...data, ...this.prisma.auditCreate(userId) },
      include: WOREDA_INCLUDE,
    });
  }

  async update(id: string, data: any, userId?: string) {
    return this.prisma.woreda.update({
      where: { id },
      data: { ...data, ...this.prisma.auditUpdate(userId) },
      include: WOREDA_INCLUDE,
    });
  }

  async softDelete(id: string, userId?: string) {
    await this.prisma.woreda.update({
      where: { id },
      data: { ...this.prisma.softDelete(), ...this.prisma.auditUpdate(userId) },
    });
  }
}