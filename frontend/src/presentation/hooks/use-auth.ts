"use client";

import { useSession } from "next-auth/react";
import { useCallback, useMemo } from "react";
import { RbacDomainService } from "@/domain/rbac/services";

export function useAuth() {
  const { data: session, status } = useSession();

  const user = session?.user;
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const hasRole = useCallback(
    (role: string) => {
      if (!user?.roles) return false;
      return RbacDomainService.hasRole(user.roles, role);
    },
    [user?.roles],
  );

  const hasAnyRole = useCallback(
    (roles: string[]) => {
      if (!user?.roles) return false;
      return RbacDomainService.hasAnyRole(user.roles, roles);
    },
    [user?.roles],
  );

  const hasPermission = useCallback(
    (permission: string) => {
      if (!user?.permissions || !user?.roles) return false;
      return RbacDomainService.hasPermission(
        user.permissions,
        user.roles,
        permission,
      );
    },
    [user?.permissions, user?.roles],
  );

  const hasAnyPermission = useCallback(
    (permissions: string[]) => {
      if (!user?.permissions || !user?.roles) return false;
      return RbacDomainService.hasAnyPermission(
        user.permissions,
        user.roles,
        permissions,
      );
    },
    [user?.permissions, user?.roles],
  );

  const hasAllPermissions = useCallback(
    (permissions: string[]) => {
      if (!user?.permissions || !user?.roles) return false;
      return RbacDomainService.hasAllPermissions(
        user.permissions,
        user.roles,
        permissions,
      );
    },
    [user?.permissions, user?.roles],
  );

  const isSuperAdmin = useMemo(
    () => (user?.roles ? RbacDomainService.isSuperAdmin(user.roles) : false),
    [user?.roles],
  );

  const isAdmin = useMemo(
    () => (user?.roles ? RbacDomainService.isAdmin(user.roles) : false),
    [user?.roles],
  );

  return {
    user,
    session,
    status,
    isAuthenticated,
    isLoading,
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isSuperAdmin,
    isAdmin,
  };
}
