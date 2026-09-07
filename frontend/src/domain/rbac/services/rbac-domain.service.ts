/**
 * Client-side RBAC Domain Service
 * Pure business logic for permission and role checking.
 * Configurable — no hardcoded role names.
 */
export class RbacDomainService {
  private static superAdminRole = "super_admin";
  private static systemRoles: string[] = ["super_admin", "admin"];

  /**
   * Configure at app startup (e.g. in providers.tsx or layout.tsx).
   * Allows the super-admin role name and system roles to be set dynamically.
   */
  static configure(options: {
    superAdminRole?: string;
    systemRoles?: string[];
  }): void {
    if (options.superAdminRole) this.superAdminRole = options.superAdminRole;
    if (options.systemRoles) this.systemRoles = options.systemRoles;
  }

  static getSuperAdminRole(): string {
    return this.superAdminRole;
  }

  static getSystemRoles(): string[] {
    return [...this.systemRoles];
  }

  static isSuperAdmin(roles: string[]): boolean {
    return roles.includes(this.superAdminRole);
  }

  static hasRole(userRoles: string[], role: string): boolean {
    if (RbacDomainService.isSuperAdmin(userRoles)) return true;
    return userRoles.includes(role);
  }

  static hasAnyRole(userRoles: string[], roles: string[]): boolean {
    if (RbacDomainService.isSuperAdmin(userRoles)) return true;
    return roles.some((role) => userRoles.includes(role));
  }

  static hasPermission(
    userPermissions: string[],
    userRoles: string[],
    permission: string,
  ): boolean {
    if (RbacDomainService.isSuperAdmin(userRoles)) return true;
    return userPermissions.includes(permission);
  }

  static hasAnyPermission(
    userPermissions: string[],
    userRoles: string[],
    permissions: string[],
  ): boolean {
    if (RbacDomainService.isSuperAdmin(userRoles)) return true;
    return permissions.some((p) => userPermissions.includes(p));
  }

  static hasAllPermissions(
    userPermissions: string[],
    userRoles: string[],
    permissions: string[],
  ): boolean {
    if (RbacDomainService.isSuperAdmin(userRoles)) return true;
    return permissions.every((p) => userPermissions.includes(p));
  }

  static isAdmin(userRoles: string[]): boolean {
    return RbacDomainService.hasAnyRole(userRoles, this.systemRoles);
  }

  /**
   * Check if a role name is a system role (cannot be modified/deleted in the UI).
   */
  static isSystemRole(roleName: string): boolean {
    return this.systemRoles.includes(roleName);
  }
}
