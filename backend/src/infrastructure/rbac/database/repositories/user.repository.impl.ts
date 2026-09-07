import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { IUserRepository } from '../../../../domain/rbac/repositories/user.repository';
import { USER_INCLUDE } from '../entities';
import { PaginationUtil } from '../../../../shared/utils';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    isActive?: boolean;
    roleId?: string;
  }) {
    const where: any = {
      ...this.prisma.softDeleteFilter(),
    };

    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { username: { contains: query.search, mode: 'insensitive' } },
        { mobileNumber: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    if (query.roleId) {
      where.userRoles = {
        some: { roleId: query.roleId, deletedAt: null },
      };
    }

    const skip = PaginationUtil.calculateSkip(query.page, query.limit);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: {
          userRoles: {
            where: { deletedAt: null },
            include: { role: true },
          },
        },
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  async findById(id: string) {
    return this.prisma.user.findFirst({
      where: { id, ...this.prisma.softDeleteFilter() },
      include: USER_INCLUDE,
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email, ...this.prisma.softDeleteFilter() },
      include: USER_INCLUDE,
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findFirst({
      where: { username, ...this.prisma.softDeleteFilter() },
      include: USER_INCLUDE,
    });
  }

  async findByMobileNumber(mobileNumber: string) {
    return this.prisma.user.findFirst({
      where: { mobileNumber, ...this.prisma.softDeleteFilter() },
      include: USER_INCLUDE,
    });
  }

  async create(data: any) {
    const { audit, ...userData } = data;
    return this.prisma.user.create({
      data: {
        ...userData,
        ...(audit ? this.prisma.auditCreate(audit.createdBy) : {}),
      },
      include: USER_INCLUDE,
    });
  }

  async update(id: string, data: any) {
    const { audit, ...userData } = data;
    return this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        ...(audit ? this.prisma.auditUpdate(audit.updatedBy) : {}),
      },
      include: USER_INCLUDE,
    });
  }

  async softDelete(id: string, userId?: string) {
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id },
        data: {
          ...this.prisma.softDelete(),
          ...this.prisma.auditUpdate(userId),
        },
      }),
      this.prisma.userRole.updateMany({
        where: { userId: id, deletedAt: null },
        data: {
          ...this.prisma.softDelete(),
          ...this.prisma.auditUpdate(userId),
        },
      }),
    ]);
  }

  async assignRoles(userId: string, roleIds: string[], currentUserId?: string) {
    // Soft-delete existing roles
    await this.prisma.userRole.updateMany({
      where: { userId, deletedAt: null },
      data: {
        ...this.prisma.softDelete(),
        ...this.prisma.auditUpdate(currentUserId),
      },
    });

    // Create new role assignments
    if (roleIds.length > 0) {
      await this.prisma.userRole.createMany({
        data: roleIds.map((roleId) => ({
          userId,
          roleId,
          ...this.prisma.auditCreate(currentUserId),
        })),
      });
    }
  }

  async unlock(id: string, updatedBy?: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        isLocked: false,
        failedLoginAttempts: 0,
        ...this.prisma.auditUpdate(updatedBy),
      },
    });
  }
}
