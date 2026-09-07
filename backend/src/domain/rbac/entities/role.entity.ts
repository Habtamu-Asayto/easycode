export interface RoleEntity {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  isSystem: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface RolePermissionInfo {
  id: string;
  name: string;
  displayName: string;
  module: string;
  action: string;
}

export interface RoleResponseModel {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  isSystem: boolean;
  isActive: boolean;
  permissions: RolePermissionInfo[];
  userCount: number;
  createdAt: Date;
  updatedAt: Date;
}
