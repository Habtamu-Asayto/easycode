import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { IRegionRepository } from '../../../../domain/geography/repositories/region.repository';
import { RegionEntity } from '../../../../domain/geography/entities/region.entity';
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
  }): Promise<{
    items: RegionEntity[];
    total: number;
  }> {
    const where: Prisma.RegionWhereInput = {
      ...this.prisma.softDeleteFilter(),
    };

    if (query.search) {
      where.OR = [
        {
          name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          code: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const skip = PaginationUtil.calculateSkip(
      query.page,
      query.limit,
    );

    const [items, total] = await Promise.all([
      this.prisma.region.findMany({
        where,
        orderBy: {
          [query.sortBy]: query.sortOrder,
        },
        skip,
        take: query.limit,
      }),

      this.prisma.region.count({
        where,
      }),
    ]);

    return {
      items: items as RegionEntity[],
      total,
    };
  }

  async findById(id: string): Promise<RegionEntity | null> {
    const region = await this.prisma.region.findFirst({
      where: {
        id,
        ...this.prisma.softDeleteFilter(),
      },
    });

    return region as RegionEntity | null;
  }

  async findByCode(code: string): Promise<RegionEntity | null> {
    const region = await this.prisma.region.findFirst({
      where: {
        code,
        ...this.prisma.softDeleteFilter(),
      },
    });

    return region as RegionEntity | null;
  }

  async create(
    data: Partial<RegionEntity>,
    userId?: string,
  ): Promise<RegionEntity> {
    const region = await this.prisma.region.create({
      data: {
        name: data.name!,
        code: data.code!,
        isActive: data.isActive ?? true,
        ...this.prisma.auditCreate(userId),
      },
    });

    return region as RegionEntity;
  }

  async update(
    id: string,
    data: Partial<RegionEntity>,
    userId?: string,
  ): Promise<RegionEntity> {
    const region = await this.prisma.region.update({
      where: {
        id,
      },
      data: {
        ...data,
        ...this.prisma.auditUpdate(userId),
      },
    });

    return region as RegionEntity;
  }

  async softDelete(
    id: string,
    userId?: string,
  ): Promise<void> {
    await this.prisma.region.update({
      where: {
        id,
      },
      data: {
        ...this.prisma.softDelete(),
        ...this.prisma.auditUpdate(userId),
      },
    });
  }

  async lookup(): Promise<
    Pick<RegionEntity, 'id' | 'name' | 'code'>[]
  > {
    return this.prisma.region.findMany({
      where: {
        isActive: true,
        ...this.prisma.softDeleteFilter(),
      },
      select: {
        id: true,
        name: true,
        code: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}