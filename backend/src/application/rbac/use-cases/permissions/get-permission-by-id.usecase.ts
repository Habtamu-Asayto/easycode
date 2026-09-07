import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants';
import type { IPermissionRepository } from '../../../../domain/rbac/repositories/permission.repository';

@Injectable()
export class GetPermissionByIdUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.PERMISSION_REPOSITORY)
    private readonly permissionRepo: IPermissionRepository,
  ) {}

  async execute(id: string) {
    const permission = await this.permissionRepo.findById(id);
    if (!permission || permission.deletedAt) {
      throw new NotFoundException(`Permission with ID "${id}" not found`);
    }

    return {
      id: permission.id,
      name: permission.name,
      displayName: permission.displayName,
      description: permission.description,
      module: permission.module,
      action: permission.action,
      isActive: permission.isActive,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }
}
