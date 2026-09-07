import { Provider } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../shared/constants';

// Infrastructure repository implementations
import { PrismaUserRepository } from '../../../infrastructure/rbac/database/repositories/user.repository.impl';
import { PrismaRoleRepository } from '../../../infrastructure/rbac/database/repositories/role.repository.impl';
import { PrismaPermissionRepository } from '../../../infrastructure/rbac/database/repositories/permission.repository.impl';
import { PrismaAuditRepository } from '../../../infrastructure/rbac/database/repositories/audit.repository.impl';
import { PrismaRefreshTokenRepository } from '../../../infrastructure/rbac/database/repositories/refresh-token.repository.impl';

// Auth use cases
import { LoginUseCase } from '../../../application/rbac/use-cases/auth/login.usecase';
import { RefreshTokensUseCase } from '../../../application/rbac/use-cases/auth/refresh-tokens.usecase';
import { LogoutUseCase } from '../../../application/rbac/use-cases/auth/logout.usecase';
import { ChangePasswordUseCase } from '../../../application/rbac/use-cases/auth/change-password.usecase';
import { GetProfileUseCase } from '../../../application/rbac/use-cases/auth/get-profile.usecase';

// User use cases
import { GetUsersUseCase } from '../../../application/rbac/use-cases/users/get-users.usecase';
import { GetUserByIdUseCase } from '../../../application/rbac/use-cases/users/get-user-by-id.usecase';
import { CreateUserUseCase } from '../../../application/rbac/use-cases/users/create-user.usecase';
import { UpdateUserUseCase } from '../../../application/rbac/use-cases/users/update-user.usecase';
import { DeleteUserUseCase } from '../../../application/rbac/use-cases/users/delete-user.usecase';
import { ResetPasswordUseCase } from '../../../application/rbac/use-cases/users/reset-password.usecase';
import { ToggleActiveUseCase } from '../../../application/rbac/use-cases/users/toggle-active.usecase';
import { UnlockUserUseCase } from '../../../application/rbac/use-cases/users/unlock-user.usecase';

// Role use cases
import { GetRolesUseCase } from '../../../application/rbac/use-cases/roles/get-roles.usecase';
import { GetRoleByIdUseCase } from '../../../application/rbac/use-cases/roles/get-role-by-id.usecase';
import { CreateRoleUseCase } from '../../../application/rbac/use-cases/roles/create-role.usecase';
import { UpdateRoleUseCase } from '../../../application/rbac/use-cases/roles/update-role.usecase';
import { DeleteRoleUseCase } from '../../../application/rbac/use-cases/roles/delete-role.usecase';

// Permission use cases
import { GetPermissionsUseCase } from '../../../application/rbac/use-cases/permissions/get-permissions.usecase';
import { GetActivePermissionsUseCase } from '../../../application/rbac/use-cases/permissions/get-active-permissions.usecase';
import { GetGroupedPermissionsUseCase } from '../../../application/rbac/use-cases/permissions/get-grouped-permissions.usecase';
import { GetPermissionModulesUseCase } from '../../../application/rbac/use-cases/permissions/get-permission-modules.usecase';
import { GetPermissionByIdUseCase } from '../../../application/rbac/use-cases/permissions/get-permission-by-id.usecase';
import { CreatePermissionUseCase } from '../../../application/rbac/use-cases/permissions/create-permission.usecase';
import { UpdatePermissionUseCase } from '../../../application/rbac/use-cases/permissions/update-permission.usecase';
import { DeletePermissionUseCase } from '../../../application/rbac/use-cases/permissions/delete-permission.usecase';

// Audit use cases
import { GetAuditLogsUseCase } from '../../../application/rbac/use-cases/audit/get-audit-logs.usecase';

/**
 * Repository providers — binds domain interfaces to infrastructure implementations.
 * This is the key DI configuration that enables Clean Architecture's dependency inversion.
 */
export const repositoryProviders: Provider[] = [
  {
    provide: REPOSITORY_TOKENS.USER_REPOSITORY,
    useClass: PrismaUserRepository,
  },
  {
    provide: REPOSITORY_TOKENS.ROLE_REPOSITORY,
    useClass: PrismaRoleRepository,
  },
  {
    provide: REPOSITORY_TOKENS.PERMISSION_REPOSITORY,
    useClass: PrismaPermissionRepository,
  },
  {
    provide: REPOSITORY_TOKENS.AUDIT_REPOSITORY,
    useClass: PrismaAuditRepository,
  },
  {
    provide: REPOSITORY_TOKENS.REFRESH_TOKEN_REPOSITORY,
    useClass: PrismaRefreshTokenRepository,
  },
];

/**
 * All use case providers for the RBAC module.
 */
export const useCaseProviders: Provider[] = [
  // Auth
  LoginUseCase,
  RefreshTokensUseCase,
  LogoutUseCase,
  ChangePasswordUseCase,
  GetProfileUseCase,
  // Users
  GetUsersUseCase,
  GetUserByIdUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  ResetPasswordUseCase,
  ToggleActiveUseCase,
  UnlockUserUseCase,
  // Roles
  GetRolesUseCase,
  GetRoleByIdUseCase,
  CreateRoleUseCase,
  UpdateRoleUseCase,
  DeleteRoleUseCase,
  // Permissions
  GetPermissionsUseCase,
  GetActivePermissionsUseCase,
  GetGroupedPermissionsUseCase,
  GetPermissionModulesUseCase,
  GetPermissionByIdUseCase,
  CreatePermissionUseCase,
  UpdatePermissionUseCase,
  DeletePermissionUseCase,
  // Audit
  GetAuditLogsUseCase,
];
