export interface WoredaEntity {
  id: string;
  name: string;
  code: string;
  zoneId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface WoredaResponseModel {
  id: string;
  name: string;
  code: string;
  zoneId: string;
  isActive: boolean;
  zone?: { id: string; name: string; region?: { id: string; name: string } };
  createdAt: Date;
  updatedAt: Date;
}