import { UserEntity } from '../domain/user.entity';

function hasPermission(
  raw: any,
  permissionKey: string,
  defaultValue: boolean,
): boolean {
  if (!raw) return defaultValue;

  const roleName = raw.Role?.name || raw.role;
  if (roleName === 'superadmin') return true;

  // 1. Check custom UserPermission overrides
  const overrides = raw.Permissions || [];
  const override = overrides.find(
    (p: any) => p.Permission?.key === permissionKey,
  );
  if (override) {
    return override.value === 'ALLOW';
  }

  // 2. Fallback to Role default permissions
  const rolePermissions = raw.Role?.Permissions || [];
  const hasRolePerm = rolePermissions.some(
    (rp: any) => rp.Permission?.key === permissionKey,
  );
  if (hasRolePerm) return true;

  return defaultValue;
}

export class UserMapper {
  static toDomain(raw: any): UserEntity | null {
    if (!raw) return null;

    const bDate = raw.Profile?.birthday || raw.birthday;
    const finalBirthday = bDate ? new Date(bDate) : null;

    return new UserEntity({
      id: raw.id,
      username: raw.username,
      email: raw.email,
      password: raw.password,
      fullname: raw.Profile?.fullname ?? raw.fullname ?? null,
      avatar: raw.Profile?.avatar ?? raw.avatar ?? null,
      profession: raw.Profile?.profession ?? raw.profession ?? null,
      role: raw.Role?.name ?? raw.role ?? 'user',
      role_id: raw.role_id,
      phone: raw.Profile?.phone ?? raw.phone ?? null,
      birthday:
        finalBirthday && !isNaN(finalBirthday.getTime()) ? finalBirthday : null,
      address: raw.Profile?.address ?? raw.address ?? null,
      bio: raw.Profile?.bio ?? raw.bio ?? null,
      is_active: raw.is_active,
      can_comment: hasPermission(raw, 'comments:create', true),
      can_post: hasPermission(raw, 'posts:create', true),
      can_manage_categories: hasPermission(raw, 'categories:manage', false),
      can_manage_series: hasPermission(raw, 'series:manage', false),
      can_manage_comments: hasPermission(raw, 'comments:manage', false),
      can_manage_settings: hasPermission(raw, 'settings:manage', false),
      can_manage_users: hasPermission(raw, 'users:manage', false),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
      last_login: raw.last_login || raw.last_login_at,
      social_links: raw.social_links,
    });
  }
}
