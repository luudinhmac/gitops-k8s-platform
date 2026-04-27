import { User, UserRole } from '@portfolio/types';
import { UserEntity } from '../../domain/entities/user.entity';

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
      role: raw.role as UserRole,
      phone: raw.phone,
      birthday: raw.birthday,
      address: raw.address,
      is_active: raw.is_active,
      can_comment: raw.can_comment,
      can_post: raw.can_post,
      created_at: raw.created_at,
    });
  }
}
