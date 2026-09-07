# RBAC Backend

## start from schema

```bash

// ============================================================================
// RBAC Models
// ============================================================================

model User {
  id           String   @id @default(uuid()) @db.Uuid
  email        String   @unique @db.VarChar(255)
  username     String   @unique @db.VarChar(100)
  mobileNumber String?  @unique @map("mobile_number") @db.VarChar(20)
  password     String   @db.VarChar(255)
  firstName    String   @map("first_name") @db.VarChar(100)
  lastName     String   @map("last_name") @db.VarChar(100)
  phone        String?  @db.VarChar(20)
  avatar       String?  @db.VarChar(500)
  isActive     Boolean  @default(true) @map("is_active")
  isLocked     Boolean  @default(false) @map("is_locked")
  lastLoginAt       DateTime? @map("last_login_at")
  failedLoginAttempts Int @default(0) @map("failed_login_attempts")
  passwordChangedAt DateTime? @map("password_changed_at")

  // Geography assignment (only one should be set for non-admin users)
  regionId String? @map("region_id") @db.Uuid

  // Audit fields
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")
  createdBy String?   @map("created_by") @db.Uuid
  updatedBy String?   @map("updated_by") @db.Uuid

  // Relations
  userRoles     UserRole[]
  refreshTokens RefreshToken[]
  auditLogs     AuditLog[]
  region        Region? @relation(fields: [regionId], references: [id])

  @@map("users")
  @@index([email])
  @@index([username])
  @@index([mobileNumber])
  @@index([deletedAt])
  @@index([regionId])
}

model Role {
  id          String  @id @default(uuid()) @db.Uuid
  name        String  @unique @db.VarChar(100)
  displayName String  @map("display_name") @db.VarChar(150)
  description String? @db.VarChar(500)
  isSystem    Boolean @default(false) @map("is_system")
  isActive    Boolean @default(true) @map("is_active")

  // Audit fields
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")
  createdBy String?   @map("created_by") @db.Uuid
  updatedBy String?   @map("updated_by") @db.Uuid

  // Relations
  userRoles       UserRole[]
  rolePermissions RolePermission[]

  @@map("roles")
  @@index([name])
  @@index([deletedAt])
}

model Permission {
  id          String  @id @default(uuid()) @db.Uuid
  name        String  @unique @db.VarChar(150)
  displayName String  @map("display_name") @db.VarChar(200)
  description String? @db.VarChar(500)
  module      String  @db.VarChar(100)
  action      String  @db.VarChar(50)
  isActive    Boolean @default(true) @map("is_active")

  // Audit fields
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")
  createdBy String?   @map("created_by") @db.Uuid
  updatedBy String?   @map("updated_by") @db.Uuid

  // Relations
  rolePermissions RolePermission[]

  @@unique([module, action])
  @@map("permissions")
  @@index([module])
  @@index([deletedAt])
}

model UserRole {
  id     String @id @default(uuid()) @db.Uuid
  userId String @map("user_id") @db.Uuid
  roleId String @map("role_id") @db.Uuid

  // Audit fields
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")
  createdBy String?   @map("created_by") @db.Uuid
  updatedBy String?   @map("updated_by") @db.Uuid

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@unique([userId, roleId])
  @@map("user_roles")
  @@index([userId])
  @@index([roleId])
  @@index([deletedAt])
}

model RolePermission {
  id           String @id @default(uuid()) @db.Uuid
  roleId       String @map("role_id") @db.Uuid
  permissionId String @map("permission_id") @db.Uuid

  // Audit fields
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")
  createdBy String?   @map("created_by") @db.Uuid
  updatedBy String?   @map("updated_by") @db.Uuid

  // Relations
  role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@unique([roleId, permissionId])
  @@map("role_permissions")
  @@index([roleId])
  @@index([permissionId])
  @@index([deletedAt])
}

model RefreshToken {
  id        String    @id @default(uuid()) @db.Uuid
  token     String    @unique @db.VarChar(500)
  userId    String    @map("user_id") @db.Uuid
  expiresAt DateTime  @map("expires_at")
  revokedAt DateTime? @map("revoked_at")
  ipAddress String?   @map("ip_address") @db.VarChar(45)
  userAgent String?   @map("user_agent") @db.VarChar(500)

  // Audit fields
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("refresh_tokens")
  @@index([userId])
  @@index([token])
  @@index([expiresAt])
}

model AuditLog {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String?  @map("user_id") @db.Uuid
  action    String   @db.VarChar(50)
  entity    String   @db.VarChar(100)
  entityId  String?  @map("entity_id") @db.VarChar(100)
  oldValues Json?    @map("old_values")
  newValues Json?    @map("new_values")
  ipAddress String?  @map("ip_address") @db.VarChar(45)
  userAgent String?  @map("user_agent") @db.VarChar(500)
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@map("audit_logs")
  @@index([userId])
  @@index([entity])
  @@index([action])
  @@index([createdAt])
}


```

- Move to migration

```
npx prisma migrate dev --name init
```

- Then the same SQL table must be created prisma/migrations.sql

- Generate Prisma Client

```
npx prisma generate
```

- Verify the database visually by running

```
npx prisma studio

```

- Verify from PostgreSQL itself

```

docker exec -it easycode psql -U postgres -d easy_db

```

## Add seed / mocked data

#### Add on seed.ts

####================

```bash
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 12;

const MODULES = ['users', 'roles', 'permissions', 'audit'];
const ACTIONS = ['create', 'read', 'update', 'delete', 'manage', 'export'];

async function main() {
console.log('🌱 Seeding database...');

// Create permissions for each module
const permissions: any[] = [];
for (const module of MODULES) {
  for (const action of ACTIONS) {
    const name = `${module}:${action}`;
    const displayName = `${action.charAt(0).toUpperCase() + action.slice(1)} ${module.charAt(0).toUpperCase() + module.slice(1)}`;

    const permission = await prisma.permission.upsert({
      where: { name },
      update: {},
      create: {
        name,
        displayName,
        description: `Permission to ${action} ${module}`,
        module,
        action,
        isActive: true,
      },
    });
    permissions.push(permission);
    console.log(`  ✅ Permission: ${name}`);
  }
}

// Create roles
const superAdminRole = await prisma.role.upsert({
  where: { name: 'super_admin' },
  update: {},
  create: {
    name: 'super_admin',
    displayName: 'Super Administrator',
    description: 'Full system access with all permissions',
    isSystem: true,
    isActive: true,
  },
});
console.log('  ✅ Role: Super Admin');

const adminRole = await prisma.role.upsert({
  where: { name: 'admin' },
  update: {},
  create: {
    name: 'admin',
    displayName: 'Administrator',
    description: 'Administrative access for user and role management',
    isSystem: true,
    isActive: true,
  },
});
console.log('  ✅ Role: Admin');

const managerRole = await prisma.role.upsert({
  where: { name: 'manager' },
  update: {},
  create: {
    name: 'manager',
    displayName: 'Manager',
    description: 'Manager with read and limited update access',
    isSystem: false,
    isActive: true,
  },
});
console.log('  ✅ Role: Manager');

const userRole = await prisma.role.upsert({
  where: { name: 'user' },
  update: {},
  create: {
    name: 'user',
    displayName: 'Standard User',
    description: 'Basic user with read-only access',
    isSystem: false,
    isActive: true,
  },
});
console.log('  ✅ Role: User');

// Assign all permissions to super_admin
for (const permission of permissions) {
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
      },
    },
    update: {},
    create: {
      roleId: superAdminRole.id,
      permissionId: permission.id,
    },
  });
}
console.log('  ✅ Super Admin: All permissions assigned');

// Assign admin permissions (all except permission management)
const adminPermissions = permissions.filter(
  (p) => p.module !== 'permissions' || p.action === 'read',
);
for (const permission of adminPermissions) {
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    },
    update: {},
    create: {
      roleId: adminRole.id,
      permissionId: permission.id,
    },
  });
}
console.log('  ✅ Admin: Permissions assigned');

// Manager: read on users, roles, and audit
const managerPermissions = permissions.filter(
  (p) =>
    (p.module === 'users' && ['read'].includes(p.action)) ||
    (p.module === 'roles' && ['read'].includes(p.action)) ||
    (p.module === 'audit' && ['read'].includes(p.action)),
);
for (const permission of managerPermissions) {
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: managerRole.id,
        permissionId: permission.id,
      },
    },
    update: {},
    create: {
      roleId: managerRole.id,
      permissionId: permission.id,
    },
  });
}
console.log('  ✅ Manager: Permissions assigned');

// User: read only on users
const userPermissions = permissions.filter(
  (p) => p.module === 'users' && p.action === 'read',
);
for (const permission of userPermissions) {
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: userRole.id,
        permissionId: permission.id,
      },
    },
    update: {},
    create: {
      roleId: userRole.id,
      permissionId: permission.id,
    },
  });
}
console.log('  ✅ User: Permissions assigned');

// Create super admin user
const hashedPassword = await bcrypt.hash('Admin@123456', SALT_ROUNDS);
const superAdmin = await prisma.user.upsert({
  where: { email: 'admin@fms.com' },
  update: {},
  create: {
    email: 'admin@fms.com',
    username: 'superadmin',
    password: hashedPassword,
    firstName: 'Super',
    lastName: 'Admin',
    phone: '+1234567890',
    isActive: true,
  },
});
console.log('  ✅ Super Admin User created (admin@fms.com / Admin@123456)');

// Assign super_admin role to the user
await prisma.userRole.upsert({
  where: {
    userId_roleId: {
      userId: superAdmin.id,
      roleId: superAdminRole.id,
    },
  },
  update: {},
  create: {
    userId: superAdmin.id,
    roleId: superAdminRole.id,
  },
});
console.log('  ✅ Super Admin role assigned to admin user');

// Create a demo regular user
const demoPassword = await bcrypt.hash('User@123456', SALT_ROUNDS);
const demoUser = await prisma.user.upsert({
  where: { email: 'user@fms.com' },
  update: {},
  create: {
    email: 'user@fms.com',
    username: 'demouser',
    password: demoPassword,
    firstName: 'Demo',
    lastName: 'User',
    isActive: true,
  },
});

await prisma.userRole.upsert({
  where: {
    userId_roleId: {
      userId: demoUser.id,
      roleId: userRole.id,
    },
  },
  update: {},
  create: {
    userId: demoUser.id,
    roleId: userRole.id,
  },
});
console.log('  ✅ Demo User created (user@fms.com / User@123456)');

console.log('\n🎉 Seeding completed!');
}

main()
.catch((e) => {
  console.error('❌ Seeding failed:', e);
  process.exit(1);
})
.finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});
```

#### Validate prisma

    	npx prisma validate

#### Then, Run->

    npx prisma migrate dev --name init,

- later i may use : npx prisma migrate dev --name add_model_name

#### if error occur's

    npx prisma migrate reset

#### Then->

    npx prisma generate

#### Insert initial/default data

    /// npx ts-node prisma/seeds/seed.ts
    npx prisma db seed

#### To check seeded data on prisma studio

    npx prisma studio

#### We can also check the postgresql on docker using window powershell

    docker exec -it n3-postgres psql -U postgres -d n3_db

#### Exit

    \q

##### List Database

    \l

##### List Tables

    \dt		\d users

## Domain

- Create:

```
backend/src/domain/geography/entities/<file_name>.entity.ts   

```

- Entity for user, role, refresh-token, permission, audit log are created

## Domain repository interface

```
src/domain/rbac/repositories/region.repository.ts    and add:

```

- Repository for user, role, refresh-token, permission, audit are created

## PrismaService

- Already created on

```

src/infrastructure/database/prisma/prisma.service.ts  The add:

``` 

## RBAC Service


```
src/domain/rbac/services/rbac.repository.ts with index.ts to export it

```

## Created shared components (utils, ....)


## Infrastructure

### Repositories

  ```
  src/infrastructure/rbac/database/repositories/......

  ```

### Database module also created there

  ```
  src/infrastructure/rbac/database/database.module.ts

  ```

  ## Presentation

  ### Provider
  
  ```
  src/presentation/rbac/providers/rbac.providers.ts and other files (controllers, decorators, and guards) and 

  ```
  
  ```
  src/presentation/rbac/rbac.module.ts  

  ```

  ## Register RbacModule and other role based securities to app.module.ts

- Open:

```
backend/src/app.module.ts  Then Add:
```

## DTO and zod

- shared dto on shared folder

- Create

```

backend/src/application/rbac/dto/.......

```

```

backend/src/application/rbac/use-cases/.........

```

### Create rbac Wrapper

- Create:

```
backend/src/infrastructure/rbac/database/entities/..........   


```

## Test

# RBAC frontend

## Create the Region domain entity/type

- Create:

```
frontend/src/domain/rbac/entities/index.ts and Add:

```


## Create the Region API response/query types

### Add pagination types

- Create:

```
frontend/src/domain/shared/entities/index.ts
```

## Create Axios API client

### Create the shared Axios client

- create:

```
frontend/src/infrastructure/rbac/api/.....

```

### Create the hooks file

- Create:

```
frontend/src/presentation/hooks/rbac/region.hooks.ts
```