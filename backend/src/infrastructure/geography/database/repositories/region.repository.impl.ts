import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { IRegionRepository } from '../../../../domain/geography/repositories/region.repository';
import { PaginationUtil } from '../../../../shared/utils';

@Injectable()
export class PrismaRegionRepository implements IRegionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    isActive?: boolean;
  }) {
    const where: any = { ...this.prisma.softDeleteFilter() };
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const skip = PaginationUtil.calculateSkip(query.page, query.limit);
    const [items, total] = await Promise.all([
      this.prisma.region.findMany({
        where,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit,
      }),
      this.prisma.region.count({ where }),
    ]);
    return { items, total };
  }

  async findById(id: string) {
    return this.prisma.region.findFirst({
      where: { id, ...this.prisma.softDeleteFilter() },
    });
  }

  async create(data: any, userId?: string) {
    return this.prisma.region.create({
      data: { ...data, ...this.prisma.auditCreate(userId) },
    });
  }

  async update(id: string, data: any, userId?: string) {
    return this.prisma.region.update({
      where: { id },
      data: { ...data, ...this.prisma.auditUpdate(userId) },
    });
  }

  async softDelete(id: string, userId?: string) {
    await this.prisma.region.update({
      where: { id },
      data: { ...this.prisma.softDelete(), ...this.prisma.auditUpdate(userId) },
    });
  }

  async lookup() {
    return this.prisma.region.findMany({
      where: { isActive: true, ...this.prisma.softDeleteFilter() },
      select: { id: true, name: true, code: true },
      orderBy: { name: 'asc' },
    });
  }
}