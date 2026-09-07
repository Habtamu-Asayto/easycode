export interface PermissionEntity {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  module: string;
  action: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface PermissionResponseModel {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  module: string;
  action: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type GroupedPermissions = Record<string, PermissionResponseModel[]>;
