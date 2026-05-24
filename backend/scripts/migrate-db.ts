import { PrismaClient, OverrideType } from '@prisma/client';

declare const process: any;

const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING DATABASE DATA MIGRATION & SEEDING ---');

  // 1. Seed Roles
  console.log('1. Seeding default roles...');
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
    console.log(` - Upserted role: ${role.name} (ID: ${upserted.id})`);
  }

  // 2. Seed Permissions
  console.log('2. Seeding default permissions...');
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
    console.log(` - Upserted permission: ${perm.key} (ID: ${upserted.id})`);
  }

  // 3. Seed RolePermission mappings
  console.log('3. Mapping default role permissions...');
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
    console.log(` - Mapped default permissions for role: ${roleName}`);
  }

  // 4. Migrate Users
  console.log('4. Migrating user details to UserProfile, UserProvider, Role association...');
  const users: any[] = await prisma.$queryRaw`SELECT * FROM "User"`;

  for (const user of users) {
    console.log(` Processing user @${user.username} (ID: ${user.id})...`);

    // A. Profile Migration
    let bDate: Date | null = null;
    if (user.birthday) {
      const parsed = new Date(user.birthday);
      if (!isNaN(parsed.getTime())) {
        bDate = parsed;
      }
    }

    await prisma.userProfile.upsert({
      where: { user_id: user.id },
      update: {
        fullname: user.fullname,
        avatar: user.avatar,
        profession: user.profession,
        phone: user.phone,
        address: user.address,
        birthday: bDate,
      },
      create: {
        user_id: user.id,
        fullname: user.fullname,
        avatar: user.avatar,
        profession: user.profession,
        phone: user.phone,
        address: user.address,
        birthday: bDate,
      }
    });
    console.log(`   -> Upserted UserProfile`);

    // B. Provider Migration
    if (user.google_id) {
      await prisma.userProvider.upsert({
        where: { provider_provider_user_id: { provider: 'google', provider_user_id: user.google_id } },
        update: { user_id: user.id },
        create: { user_id: user.id, provider: 'google', provider_user_id: user.google_id }
      });
      console.log(`   -> Migrated Google Provider ID`);
    }
    if (user.facebook_id) {
      await prisma.userProvider.upsert({
        where: { provider_provider_user_id: { provider: 'facebook', provider_user_id: user.facebook_id } },
        update: { user_id: user.id },
        create: { user_id: user.id, provider: 'facebook', provider_user_id: user.facebook_id }
      });
      console.log(`   -> Migrated Facebook Provider ID`);
    }
    if (user.apple_id) {
      await prisma.userProvider.upsert({
        where: { provider_provider_user_id: { provider: 'apple', provider_user_id: user.apple_id } },
        update: { user_id: user.id },
        create: { user_id: user.id, provider: 'apple', provider_user_id: user.apple_id }
      });
      console.log(`   -> Migrated Apple Provider ID`);
    }

    // C. Role Table ID Association
    const userRoleStr = user.role || 'user';
    const newRoleId = rolesMap[userRoleStr];
    if (newRoleId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role_id: newRoleId }
      });
      console.log(`   -> Updated role_id to ${newRoleId} (${userRoleStr})`);
    }

    // D. Custom Override Permission Migration
    // Default checks to see if user settings deviate from role default permissions
    const defaultPerms = rolePermissions[userRoleStr] || [];

    const checkOverride = async (permKey: string, currentBoolean: boolean) => {
      const isDefaultAllowed = defaultPerms.includes(permKey);
      const permId = permissionsMap[permKey];
      if (!permId) return;

      if (isDefaultAllowed && !currentBoolean) {
        // User is denied compared to default
        await prisma.userPermission.upsert({
          where: { user_id_permission_id: { user_id: user.id, permission_id: permId } },
          update: { value: OverrideType.DENY },
          create: { user_id: user.id, permission_id: permId, value: OverrideType.DENY }
        });
        console.log(`   -> Created DENY override for ${permKey}`);
      } else if (!isDefaultAllowed && currentBoolean) {
        // User is allowed compared to default
        await prisma.userPermission.upsert({
          where: { user_id_permission_id: { user_id: user.id, permission_id: permId } },
          update: { value: OverrideType.ALLOW },
          create: { user_id: user.id, permission_id: permId, value: OverrideType.ALLOW }
        });
        console.log(`   -> Created ALLOW override for ${permKey}`);
      } else {
        // Clean override if it is same as default
        await prisma.userPermission.deleteMany({
          where: { user_id: user.id, permission_id: permId }
        });
      }
    };

    // Clear any previous overrides first
    await prisma.userPermission.deleteMany({
      where: { user_id: user.id }
    });

    // Check only the legacy custom boolean columns that existed before this task
    await checkOverride('comments:create', user.can_comment);
    await checkOverride('posts:create', user.can_post);
  }

  console.log('--- DATABASE DATA MIGRATION & SEEDING COMPLETE ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
