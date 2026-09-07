import { Injectable, Inject } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants';
import type { IUserRepository } from '../../../../domain/rbac/repositories/user.repository';
import { UserQueryDto } from '../../dto';
import { PaginationUtil } from '../../../../shared/utils';

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(query: UserQueryDto) {
    const { users, total } = await this.userRepo.findAll(query);

    const items = users.map((user) => ({
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
    }));

    return {
      items,
      meta: PaginationUtil.buildMeta(query.page, query.limit, total),
    };
  }
}
