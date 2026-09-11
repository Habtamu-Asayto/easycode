"use client";

import { useSession } from "next-auth/react";

import { RbacDomainService } from "@/domain/rbac/services";

export function useAuth() {
  const { data: session, status } = useSession();

  const user = session?.user;

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const hasRole = (role: string) => {
    if (!user?.roles) return false;

    return RbacDomainService.hasRole(user.roles, role);
  };

  const hasAnyRole = (roles: string[]) => {
    if (!user?.roles) return false;

    return RbacDomainService.hasAnyRole(user.roles, roles);
  };

  const hasPermission = (permission: string) => {
    if (!user?.permissions || !user?.roles) return false;

    return RbacDomainService.hasPermission(
      user.permissions,
      user.roles,
      permission,
    );
  };

  const hasAnyPermission = (permissions: string[]) => {
    if (!user?.permissions || !user?.roles) return false;

    return RbacDomainService.hasAnyPermission(
      user.permissions,
      user.roles,
      permissions,
    );
  };

  const hasAllPermissions = (permissions: string[]) => {
    if (!user?.permissions || !user?.roles) return false;

    return RbacDomainService.hasAllPermissions(
      user.permissions,
      user.roles,
      permissions,
    );
  };

  const isSuperAdmin = user?.roles
    ? RbacDomainService.isSuperAdmin(user.roles)
    : false;

  const isAdmin = user?.roles ? RbacDomainService.isAdmin(user.roles) : false;

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
