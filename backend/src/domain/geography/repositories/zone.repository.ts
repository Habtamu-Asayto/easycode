export interface IZoneRepository {
  findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    isActive?: boolean;
    regionId?: string;
  }): Promise<{ items: any[]; total: number }>;

  findById(id: string): Promise<any | null>;
  findByRegion(regionId: string): Promise<any[]>;
  create(data: any, userId?: string): Promise<any>;
  update(id: string, data: any, userId?: string): Promise<any>;
  softDelete(id: string, userId?: string): Promise<void>;
}
