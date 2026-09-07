/**
 * Core RBAC domain service — pure business logic, no framework dependencies.
 * All role names are configurable strings; nothing is hardcoded to an enum.
 */
export class RbacDomainService {
  /**
   * Configurable super-admin role name.
   * Defaults to 'super_admin' but can be changed at startup via
   * `RbacDomainService.configure({ superAdminRole: '...' })`.
   */
  private static superAdminRole = 'super_admin';

  /**
   * Roles that are considered "system" roles and cannot be deleted/renamed.
   * Configurable at startup.
   */
  private static systemRoles: string[] = ['super_admin', 'admin'];

  /**
   * Allow runtime configuration of the RBAC domain service.
   * Call this once during application bootstrap if you need non-default values.
   */
  static configure(options: {
    superAdminRole?: string;
    systemRoles?: string[];
  }): void {
    if (options.superAdminRole) this.superAdminRole = options.superAdminRole;
    if (options.systemRoles) this.systemRoles = options.systemRoles;
  }

  /** Current super-admin role name (for external read) */
  static getSuperAdminRole(): string {
    return this.superAdminRole;
  }

  /** Current system role names (for external read) */
  static getSystemRoles(): string[] {
    return [...this.systemRoles];
  }

  /**
   * Check if a user with given roles has super admin privileges.
   */
  static isSuperAdmin(roles: string[]): boolean {
    return roles.includes(this.superAdminRole);
  }

  /**
   * Check if the user has any of the required roles.
   * Super admins always pass.
   */
  static hasRole(userRoles: string[], requiredRoles: string[]): boolean {
    if (this.isSuperAdmin(userRoles)) return true;
    return requiredRoles.some((role) => userRoles.includes(role));
  }

  /**
   * Check if the user has ALL of the required roles.
   */
  static hasAllRoles(userRoles: string[], requiredRoles: string[]): boolean {
    if (this.isSuperAdmin(userRoles)) return true;
    return requiredRoles.every((role) => userRoles.includes(role));
  }

  /**
   * Check if the user has any of the required permissions.
   * Super admins always pass.
   */
  static hasPermission(
    userRoles: string[],
    userPermissions: string[],
    requiredPermissions: string[],
  ): boolean {
    if (this.isSuperAdmin(userRoles)) return true;
    return requiredPermissions.some((perm) => userPermissions.includes(perm));
  }

  /**
   * Check if the user has ALL of the required permissions.
   */
  static hasAllPermissions(
    userRoles: string[],
    userPermissions: string[],
    requiredPermissions: string[],
  ): boolean {
    if (this.isSuperAdmin(userRoles)) return true;
    return requiredPermissions.every((perm) => userPermissions.includes(perm));
  }

  /**
   * Check if a role is a system role (cannot be modified or deleted).
   */
  static isSystemRole(roleName: string): boolean {
    return this.systemRoles.includes(roleName);
  }

  /**
   * Flatten user roles and their permissions into a unique permissions array.
   */
  static flattenPermissions(
    roles: Array<{ permissions: Array<{ name: string }> }>,
  ): string[] {
    const permSet = new Set<string>();
    for (const role of roles) {
      for (const perm of role.permissions) {
        permSet.add(perm.name);
      }
    }
    return Array.from(permSet);
  }

  /**
   * Validate password meets enterprise requirements.
   */
  static validatePasswordStrength(password: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    if (password.length < 8)
      errors.push('Password must be at least 8 characters');
    if (password.length > 128)
      errors.push('Password must be at most 128 characters');
    if (!/[a-z]/.test(password))
      errors.push('Password must contain a lowercase letter');
    if (!/[A-Z]/.test(password))
      errors.push('Password must contain an uppercase letter');
    if (!/\d/.test(password)) errors.push('Password must contain a digit');
    if (!/[@$!%*?&]/.test(password))
      errors.push('Password must contain a special character');
    return { valid: errors.length === 0, errors };
  }
}
