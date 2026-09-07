import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants';
import type { IUserRepository } from '../../../../domain/rbac/repositories/user.repository';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user || user.deletedAt) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || null,
      avatar: user.avatar || null,
      isActive: user.isActive,
      isLocked: user.isLocked,
      lastLoginAt: user.lastLoginAt,
      roles: user.userRoles
        ? user.userRoles
            .filter((ur: any) => !ur.deletedAt && ur.role && !ur.role.deletedAt)
            .map((ur: any) => ({
              id: ur.role.id,
              name: ur.role.name,
              displayName: ur.role.displayName,
            }))
        : [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
