import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { IRoleRepository } from '../../../../domain/rbac/repositories/role.repository';
import { ROLE_INCLUDE } from '../entities';
import { PaginationUtil } from '../../../../shared/utils';

@Injectable()
export class PrismaRoleRepository implements IRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    isActive?: boolean;
  }) {
    const where: any = {
      ...this.prisma.softDeleteFilter(),
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { displayName: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const skip = PaginationUtil.calculateSkip(query.page, query.limit);

    const [roles, total] = await Promise.all([
      this.prisma.role.findMany({
        where,
        include: ROLE_INCLUDE,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit,
      }),
      this.prisma.role.count({ where }),
    ]);

    return { roles, total };
  }

  async findById(id: string) {
    return this.prisma.role.findFirst({
      where: { id, ...this.prisma.softDeleteFilter() },
      include: ROLE_INCLUDE,
    });
  }

  async findByName(name: string) {
    return this.prisma.role.findFirst({
      where: { name, ...this.prisma.softDeleteFilter() },
    });
  }

  async create(data: any) {
    const { audit, ...roleData } = data;
    return this.prisma.role.create({
      data: {
        ...roleData,
        ...(audit ? this.prisma.auditCreate(audit.createdBy) : {}),
      },
      include: ROLE_INCLUDE,
    });
  }

  async update(id: string, data: any) {
    const { audit, ...roleData } = data;
    return this.prisma.role.update({
      where: { id },
      data: {
        ...roleData,
        ...(audit ? this.prisma.auditUpdate(audit.updatedBy) : {}),
      },
      include: ROLE_INCLUDE,
    });
  }

  async softDelete(id: string, userId?: string) {
    await this.prisma.$transaction([
      this.prisma.role.update({
        where: { id },
        data: {
          ...this.prisma.softDelete(),
          ...this.prisma.auditUpdate(userId),
        },
      }),
      this.prisma.rolePermission.updateMany({
        where: { roleId: id, deletedAt: null },
        data: {
          ...this.prisma.softDelete(),
          ...this.prisma.auditUpdate(userId),
        },
      }),
      this.prisma.userRole.updateMany({
        where: { roleId: id, deletedAt: null },
        data: {
          ...this.prisma.softDelete(),
          ...this.prisma.auditUpdate(userId),
        },
      }),
    ]);
  }

  async assignPermissions(
    roleId: string,
    permissionIds: string[],
    currentUserId?: string,
  ) {
    // Soft-delete existing permissions
    await this.prisma.rolePermission.updateMany({
      where: { roleId, deletedAt: null },
      data: {
        ...this.prisma.softDelete(),
        ...this.prisma.auditUpdate(currentUserId),
      },
    });

    // Create new permission assignments
    if (permissionIds.length > 0) {
      await this.prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId,
          permissionId,
          ...this.prisma.auditCreate(currentUserId),
        })),
      });
    }
  }
}
