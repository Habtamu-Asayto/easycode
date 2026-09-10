export interface KebeleEntity {
  id: string;
  name: string;
  code: string;
  woredaId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface KebeleResponseModel {
  id: string;
  name: string;
  code: string;
  woredaId: string;
  isActive: boolean;
  woreda?: { id: string; name: string; zone?: { id: string; name: string } };
  createdAt: Date;
  updatedAt: Date;
}