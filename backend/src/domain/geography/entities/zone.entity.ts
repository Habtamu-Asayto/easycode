export interface ZoneEntity {
  id: string;
  name: string;
  code: string;
  regionId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface ZoneResponseModel {
  id: string;
  name: string;
  code: string;
  regionId: string;
  isActive: boolean;
  region?: { id: string; name: string };
  createdAt: Date;
  updatedAt: Date;
}