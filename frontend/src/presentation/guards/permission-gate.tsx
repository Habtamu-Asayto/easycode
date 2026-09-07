"use client";

import { useAuth } from "@/presentation/hooks/use-auth";

interface PermissionGateProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  role?: string;
  roles?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export function PermissionGate({
  children,
  permission,
  permissions,
  role,
  roles,
  requireAll = false,
  fallback = null,
}: PermissionGateProps) {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isSuperAdmin,
  } = useAuth();

  if (isSuperAdmin) return <>{children}</>;

  // Check single permission
  if (permission && !hasPermission(permission)) return <>{fallback}</>;

  // Check multiple permissions
  if (permissions) {
    const hasPerms = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
    if (!hasPerms) return <>{fallback}</>;
  }

  // Check single role
  if (role && !hasRole(role)) return <>{fallback}</>;

  // Check multiple roles
  if (roles && !hasAnyRole(roles)) return <>{fallback}</>;

  return <>{children}</>;
}
