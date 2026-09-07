import 'dotenv/config';
import { PrismaClient } from '../../src/generated/prisma/client';
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
