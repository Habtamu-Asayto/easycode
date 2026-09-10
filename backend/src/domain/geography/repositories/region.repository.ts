export interface IRegionRepository {
  findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    isActive?: boolean;
  }): Promise<{ items: any[]; total: number }>;

  findById(id: string): Promise<any | null>;
  create(data: any, userId?: string): Promise<any>;
  update(id: string, data: any, userId?: string): Promise<any>;
  softDelete(id: string, userId?: string): Promise<void>;
  lookup(): Promise<any[]>;
}
