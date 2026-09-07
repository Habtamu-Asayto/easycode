// Re-export shared types (used by RBAC API layer)
export * from "../../shared/entities";

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ── User ──────────────────────────────────────────────────────────────────────
export interface UserResponse {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  mobileNumber: string | null;
  isActive: boolean;
  isLocked: boolean;
  failedLoginAttempts: number;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  roles: RoleResponse[];
  region: { id: string; name: string } | null;
  zone: { id: string; name: string } | null;
  woreda: { id: string; name: string } | null;
  kebele: { id: string; name: string } | null;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  mobileNumber?: string | null;
  roleIds: string[];
  regionId?: string | null;
  zoneId?: string | null;
  woredaId?: string | null;
  kebeleId?: string | null;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string | null;
  isActive?: boolean;
  roleIds?: string[];
  regionId?: string | null;
  zoneId?: string | null;
  woredaId?: string | null;
  kebeleId?: string | null;
}

export interface ResetPasswordRequest {
  newPassword: string;
}

// ── Role ──────────────────────────────────────────────────────────────────────
export interface RoleResponse {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  permissions: PermissionResponse[];
  userCount?: number;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissionIds: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
  permissionIds?: string[];
}

// ── Permission ────────────────────────────────────────────────────────────────
export interface PermissionResponse {
  id: string;
  name: string;
  description: string | null;
  module: string;
  action: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePermissionRequest {
  name: string;
  description?: string;
  module: string;
  action: string;
}

export interface UpdatePermissionRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

// ── Audit ─────────────────────────────────────────────────────────────────────
export interface AuditLogResponse {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string | null;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}
