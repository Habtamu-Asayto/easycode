import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../database/prisma/prisma.service';
import { IKebeleRepository } from '../../../../domain/geography/repositories/kebele.repository';
import { KEBELE_INCLUDE } from '../entities';
import { PaginationUtil } from '../../../../shared/utils';

@Injectable()
export class PrismaKebeleRepository implements IKebeleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    isActive?: boolean;
    woredaId?: string;
  }) {
    const where: any = { ...this.prisma.softDeleteFilter() };
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.isActive !== undefined) where.isActive = query.isActive;
    if (query.woredaId) where.woredaId = query.woredaId;

    const skip = PaginationUtil.calculateSkip(query.page, query.limit);
    const [items, total] = await Promise.all([
      this.prisma.kebele.findMany({
        where,
        include: KEBELE_INCLUDE,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit,
      }),
      this.prisma.kebele.count({ where }),
    ]);
    return { items, total };
  }

  async findById(id: string) {
    return this.prisma.kebele.findFirst({
      where: { id, ...this.prisma.softDeleteFilter() },
      include: KEBELE_INCLUDE,
    });
  }

  async findByWoreda(woredaId: string) {
    return this.prisma.kebele.findMany({
      where: { woredaId, isActive: true, ...this.prisma.softDeleteFilter() },
      include: KEBELE_INCLUDE,
      orderBy: { name: 'asc' },
    });
  }

  async create(data: any, userId?: string) {
    return this.prisma.kebele.create({
      data: { ...data, ...this.prisma.auditCreate(userId) },
      include: KEBELE_INCLUDE,
    });
  }

  async update(id: string, data: any, userId?: string) {
    return this.prisma.kebele.update({
      where: { id },
      data: { ...data, ...this.prisma.auditUpdate(userId) },
      include: KEBELE_INCLUDE,
    });
  }

  async softDelete(id: string, userId?: string) {
    await this.prisma.kebele.update({
      where: { id },
      data: { ...this.prisma.softDelete(), ...this.prisma.auditUpdate(userId) },
    });
  }
}