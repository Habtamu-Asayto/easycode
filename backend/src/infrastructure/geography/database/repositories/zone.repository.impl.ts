import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { IZoneRepository } from '../../../../domain/geography/repositories/zone.repository';
import { ZONE_INCLUDE } from '../entities';
import { PaginationUtil } from '../../../../shared/utils';

@Injectable()
export class PrismaZoneRepository implements IZoneRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    isActive?: boolean;
    regionId?: string;
  }) {
    const where: any = { ...this.prisma.softDeleteFilter() };
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.isActive !== undefined) where.isActive = query.isActive;
    if (query.regionId) where.regionId = query.regionId;

    const skip = PaginationUtil.calculateSkip(query.page, query.limit);
    const [items, total] = await Promise.all([
      this.prisma.zone.findMany({
        where,
        include: ZONE_INCLUDE,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit,
      }),
      this.prisma.zone.count({ where }),
    ]);
    return { items, total };
  }

  async findById(id: string) {
    return this.prisma.zone.findFirst({
      where: { id, ...this.prisma.softDeleteFilter() },
      include: ZONE_INCLUDE,
    });
  }

  async findByRegion(regionId: string) {
    return this.prisma.zone.findMany({
      where: { regionId, isActive: true, ...this.prisma.softDeleteFilter() },
      include: ZONE_INCLUDE,
      orderBy: { name: 'asc' },
    });
  }

  async create(data: any, userId?: string) {
    return this.prisma.zone.create({
      data: { ...data, ...this.prisma.auditCreate(userId) },
      include: ZONE_INCLUDE,
    });
  }

  async update(id: string, data: any, userId?: string) {
    return this.prisma.zone.update({
      where: { id },
      data: { ...data, ...this.prisma.auditUpdate(userId) },
      include: ZONE_INCLUDE,
    });
  }

  async softDelete(id: string, userId?: string) {
    await this.prisma.zone.update({
      where: { id },
      data: { ...this.prisma.softDelete(), ...this.prisma.auditUpdate(userId) },
    });
  }
}