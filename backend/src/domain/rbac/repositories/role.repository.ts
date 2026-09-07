import { RoleEntity } from '../entities/index.js';

export interface IRoleRepository {
  findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    isActive?: boolean;
  }): Promise<{ roles: any[]; total: number }>;

  findById(id: string): Promise<any | null>;
  findByName(name: string): Promise<any | null>;
  create(
    data: Partial<RoleEntity> & { audit?: { createdBy?: string } },
  ): Promise<any>;
  update(
    id: string,
    data: Partial<RoleEntity> & { audit?: { updatedBy?: string } },
  ): Promise<any>;
  softDelete(id: string, userId?: string): Promise<void>;
  assignPermissions(
    roleId: string,
    permissionIds: string[],
    currentUserId?: string,
  ): Promise<void>;
}
