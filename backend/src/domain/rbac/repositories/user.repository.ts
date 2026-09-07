import { UserEntity } from '../entities/index.js';

export interface IUserRepository {
  findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    isActive?: boolean;
    roleId?: string;
  }): Promise<{ users: any[]; total: number }>;

  findById(id: string): Promise<any | null>;
  findByEmail(email: string): Promise<any | null>;
  findByUsername(username: string): Promise<any | null>;
  findByMobileNumber?(mobileNumber: string): Promise<any | null>;
  create(
    data: Partial<UserEntity> & { audit?: { createdBy?: string } },
  ): Promise<any>;
  update(
    id: string,
    data: Partial<UserEntity> & { audit?: { updatedBy?: string } },
  ): Promise<any>;
  softDelete(id: string, userId?: string): Promise<void>;
  assignRoles(
    userId: string,
    roleIds: string[],
    currentUserId?: string,
  ): Promise<void>;
  unlock(id: string, updatedBy?: string): Promise<any>;
}
