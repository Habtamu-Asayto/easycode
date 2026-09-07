import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants';
import type { IUserRepository } from '../../../../domain/rbac/repositories/user.repository';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }

    const roles: Array<{ id: string; name: string; displayName: string }> = [];
    const permissions: string[] = [];

    if (user.userRoles) {
      for (const ur of user.userRoles) {
        if (!ur.deletedAt && ur.role && !ur.role.deletedAt) {
          roles.push({
            id: ur.role.id,
            name: ur.role.name,
            displayName: ur.role.displayName,
          });
          if (ur.role.rolePermissions) {
            for (const rp of ur.role.rolePermissions) {
              if (
                !rp.deletedAt &&
                rp.permission &&
                !rp.permission.deletedAt &&
                rp.permission.isActive
              ) {
                permissions.push(rp.permission.name);
              }
            }
          }
        }
      }
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      roles,
      permissions: [...new Set(permissions)],
    };
  }
}
