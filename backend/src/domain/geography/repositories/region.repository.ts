import { RegionEntity } from '../entities/region.entity';

export interface IRegionRepository {
  findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    isActive?: boolean;
  }): Promise<{
    items: RegionEntity[];
    total: number;
  }>;

  findById(id: string): Promise<RegionEntity | null>;

  findByCode(code: string): Promise<RegionEntity | null>;

  create(
    data: Partial<RegionEntity>,
    userId?: string,
  ): Promise<RegionEntity>;

  update(
    id: string,
    data: Partial<RegionEntity>,
    userId?: string,
  ): Promise<RegionEntity>;

  softDelete(id: string, userId?: string): Promise<void>;

  lookup(): Promise<
    Pick<RegionEntity, 'id' | 'name' | 'code'>[]
  >;
}