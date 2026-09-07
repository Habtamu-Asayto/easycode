import { PermissionEntity } from '../entities/index.js';

export interface IPermissionRepository {
  findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    module?: string;
    isActive?: boolean;
  }): Promise<{ permissions: any[]; total: number }>;

  findAllActive(): Promise<any[]>;
  findById(id: string): Promise<any | null>;
  findByName(name: string): Promise<any | null>;
  findByModuleAction(module: string, action: string): Promise<any | null>;
  create(
    data: Partial<PermissionEntity> & { audit?: { createdBy?: string } },
  ): Promise<any>;
  update(
    id: string,
    data: Partial<PermissionEntity> & { audit?: { updatedBy?: string } },
  ): Promise<any>;
  softDelete(id: string, userId?: string): Promise<void>;
  getDistinctModules(): Promise<string[]>;
}
