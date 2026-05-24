import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- SEEDING SETTINGS ---');

  const settings = [
    { key: 'maintenance_global', value: 'false', group: 'maintenance', is_public: true },
    { key: 'maintenance_posts', value: 'false', group: 'maintenance', is_public: true },
    { key: 'maintenance_comments', value: 'false', group: 'maintenance', is_public: true },
    { key: 'maintenance_passcode', value: '"123456"', group: 'maintenance', is_public: false },
  ];

  for (const item of settings) {
    await prisma.setting.upsert({
      where: { key: item.key },
      update: {},
      create: {
        key: item.key,
        value: item.value,
        group: item.group,
        is_public: item.is_public,
      },
    });
    console.log(`- Upserted setting: ${item.key}`);
  }

  // 1. Seed Roles
  console.log('--- SEEDING ROLES ---');
  const rolesData = [
    { name: 'superadmin', description: 'Quyền quản trị tối cao', is_system: true },
    { name: 'admin', description: 'Quản trị viên hệ thống', is_system: true },
    { name: 'editor', description: 'Biên tập viên nội dung', is_system: true },
    { name: 'user', description: 'Thành viên/Người dùng thường', is_system: true },
  ];

  const rolesMap: Record<string, number> = {};
  for (const role of rolesData) {
    const upserted = await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description, is_system: role.is_system },
      create: role,
    });
    rolesMap[role.name] = upserted.id;
    console.log(`- Upserted role: ${role.name} (ID: ${upserted.id})`);
  }

  // 2. Seed Permissions
  console.log('--- SEEDING PERMISSIONS ---');
  const permissionsData = [
    { key: 'categories:manage', name: 'Quản lý Danh mục', description: 'Thêm, sửa, xóa danh mục bài viết', is_system: true },
    { key: 'series:manage', name: 'Quản lý Series', description: 'Thêm, sửa, xóa chuỗi bài viết', is_system: true },
    { key: 'comments:manage', name: 'Quản lý Bình luận', description: 'Kiểm duyệt và xóa bình luận của người khác', is_system: true },
    { key: 'settings:manage', name: 'Quản lý Cài đặt', description: 'Thay đổi cấu hình hệ thống', is_system: true },
    { key: 'users:manage', name: 'Quản lý Thành viên', description: 'Xem, thêm, sửa, khóa tài khoản thành viên', is_system: true },
    { key: 'posts:create', name: 'Đăng bài viết', description: 'Quyền viết bài và gửi duyệt', is_system: true },
    { key: 'comments:create', name: 'Gửi bình luận', description: 'Quyền gửi bình luận trên các bài viết', is_system: true },
  ];

  const permissionsMap: Record<string, number> = {};
  for (const perm of permissionsData) {
    const upserted = await prisma.permission.upsert({
      where: { key: perm.key },
      update: { name: perm.name, description: perm.description, is_system: perm.is_system },
      create: perm,
    });
    permissionsMap[perm.key] = upserted.id;
    console.log(`- Upserted permission: ${perm.key} (ID: ${upserted.id})`);
  }

  // 3. Seed RolePermission mappings
  console.log('--- MAPPING ROLE PERMISSIONS ---');
  const rolePermissions: Record<string, string[]> = {
    superadmin: [
      'categories:manage', 'series:manage', 'comments:manage', 'settings:manage',
      'users:manage', 'posts:create', 'comments:create'
    ],
    admin: [
      'categories:manage', 'series:manage', 'comments:manage', 'settings:manage',
      'users:manage', 'posts:create', 'comments:create'
    ],
    editor: [
      'categories:manage', 'series:manage', 'comments:manage', 'posts:create', 'comments:create'
    ],
    user: [
      'comments:create'
    ]
  };

  for (const [roleName, permKeys] of Object.entries(rolePermissions)) {
    const roleId = rolesMap[roleName];
    if (!roleId) continue;

    for (const key of permKeys) {
      const permissionId = permissionsMap[key];
      if (!permissionId) continue;

      await prisma.rolePermission.upsert({
        where: {
          role_id_permission_id: {
            role_id: roleId,
            permission_id: permissionId,
          }
        },
        update: {},
        create: {
          role_id: roleId,
          permission_id: permissionId
        }
      });
    }
  }
  console.log('- Role permissions mapped successfully');

  console.log('--- SEEDING USERS ---');
  const adminPassword = process.env.ADMIN_PASSWORD || 'macld@2026';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // 4. Seed 'macld' superuser
  const macldUser = await prisma.user.upsert({
    where: { username: 'macld' },
    update: {
      role_id: rolesMap['superadmin'],
      is_active: true,
    },
    create: {
      username: 'macld',
      email: 'macld@portfolio.com',
      password: hashedPassword,
      role_id: rolesMap['superadmin'],
      is_active: true,
    },
  });

  // Seed profile for 'macld'
  await prisma.userProfile.upsert({
    where: { user_id: macldUser.id },
    update: {},
    create: {
      user_id: macldUser.id,
      fullname: 'Super Admin',
      profession: 'System Administrator',
    }
  });

  console.log(`- Upserted superuser: ${macldUser.username} with profile`);
  console.log('--- SEEDING COMPLETE ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
