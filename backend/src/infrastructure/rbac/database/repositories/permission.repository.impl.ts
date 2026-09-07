import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { IPermissionRepository } from '../../../../domain/rbac/repositories/permission.repository';
import { PaginationUtil } from '../../../../shared/utils';

@Injectable()
export class PrismaPermissionRepository implements IPermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    module?: string;
    isActive?: boolean;
  }) {
    const where: any = {
      ...this.prisma.softDeleteFilter(),
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { displayName: { contains: query.search, mode: 'insensitive' } },
        { module: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.module) {
      where.module = query.module;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const skip = PaginationUtil.calculateSkip(query.page, query.limit);

    const [permissions, total] = await Promise.all([
      this.prisma.permission.findMany({
        where,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit,
      }),
      this.prisma.permission.count({ where }),
    ]);

    return { permissions, total };
  }

  async findAllActive() {
    return this.prisma.permission.findMany({
      where: { ...this.prisma.softDeleteFilter(), isActive: true },
      orderBy: [{ module: 'asc' }, { action: 'asc' }],
    });
  }

  async findById(id: string) {
    return this.prisma.permission.findFirst({
      where: { id, ...this.prisma.softDeleteFilter() },
    });
  }

  async findByName(name: string) {
    return this.prisma.permission.findFirst({
      where: { name, ...this.prisma.softDeleteFilter() },
    });
  }

  async findByModuleAction(module: string, action: string) {
    return this.prisma.permission.findFirst({
      where: { module, action, ...this.prisma.softDeleteFilter() },
    });
  }

  async create(data: any) {
    const { audit, ...permData } = data;
    return this.prisma.permission.create({
      data: {
        ...permData,
        ...(audit ? this.prisma.auditCreate(audit.createdBy) : {}),
      },
    });
  }

  async update(id: string, data: any) {
    const { audit, ...permData } = data;
    return this.prisma.permission.update({
      where: { id },
      data: {
        ...permData,
        ...(audit ? this.prisma.auditUpdate(audit.updatedBy) : {}),
      },
    });
  }

  async softDelete(id: string, userId?: string) {
    await this.prisma.$transaction([
      this.prisma.permission.update({
        where: { id },
        data: {
          ...this.prisma.softDelete(),
          ...this.prisma.auditUpdate(userId),
        },
      }),
      this.prisma.rolePermission.updateMany({
        where: { permissionId: id, deletedAt: null },
        data: {
          ...this.prisma.softDelete(),
          ...this.prisma.auditUpdate(userId),
        },
      }),
    ]);
  }

  async getDistinctModules() {
    const result = await this.prisma.permission.findMany({
      where: { ...this.prisma.softDeleteFilter(), isActive: true },
      select: { module: true },
      distinct: ['module'],
      orderBy: { module: 'asc' },
    });
    return result.map((r) => r.module);
  }
}
