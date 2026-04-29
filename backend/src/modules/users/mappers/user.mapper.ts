import { UserEntity } from '../domain/user.entity';

export class UserMapper {
  static toDomain(raw: any): UserEntity | null {
    if (!raw) return null;
    return new UserEntity({
      id: raw.id,
      username: raw.username,
      email: raw.email,
      fullname: raw.fullname,
      password: raw.password,
      avatar: raw.avatar,
      profession: raw.profession,
      role: raw.role,
      phone: raw.phone,
      birthday: raw.birthday,
      address: raw.address,
      is_active: raw.is_active,
      can_comment: raw.can_comment,
      can_post: raw.can_post,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
      last_login: raw.last_login,
      bio: raw.bio,
      social_links: raw.social_links,
    });
  }
}
