export interface UserEntity {
  id: string;
  email: string;
  username: string;
  mobileNumber: string | null;
  password: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatar: string | null;
  isActive: boolean;
  isLocked: boolean;
  lastLoginAt: Date | null;
  failedLoginAttempts: number;
  passwordChangedAt: Date | null;
  regionId: string | null;
  zoneId: string | null;
  woredaId: string | null;
  kebeleId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface UserWithRoles extends UserEntity {
  roles: UserRoleInfo[];
  permissions: string[];
}

export interface UserRoleInfo {
  id: string;
  name: string;
  displayName: string;
}

export interface UserResponseModel {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatar: string | null;
  isActive: boolean;
  isLocked: boolean;
  lastLoginAt: Date | null;
  roles: UserRoleInfo[];
  createdAt: Date;
  updatedAt: Date;
}
