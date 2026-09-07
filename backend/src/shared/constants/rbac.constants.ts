
export const RBAC_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    SALT_ROUNDS: 12,
    MAX_FAILED_ATTEMPTS: 5,
  },
  TOKEN: {
    ACCESS_TOKEN_COOKIE: 'access_token',
    REFRESH_TOKEN_COOKIE: 'refresh_token',
  },
} as const;
 
/** Injection tokens for repository interfaces */
export const REPOSITORY_TOKENS = {
  USER_REPOSITORY: Symbol('IUserRepository'),
  ROLE_REPOSITORY: Symbol('IRoleRepository'),
  PERMISSION_REPOSITORY: Symbol('IPermissionRepository'),
  AUDIT_REPOSITORY: Symbol('IAuditRepository'),
  REFRESH_TOKEN_REPOSITORY: Symbol('IRefreshTokenRepository'),
} as const;
