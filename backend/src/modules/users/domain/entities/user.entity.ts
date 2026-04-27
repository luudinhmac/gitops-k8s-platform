import { UserRole } from '@portfolio/types';

export class UserEntity {
  id: number;
  username: string;
  email: string;
  fullname?: string;
  avatar?: string;
  role: UserRole;
  password?: string;
  is_active: boolean;
  can_comment: boolean;
  can_post: boolean;
  created_at: Date;
  updated_at: Date;
  phone?: string;
  address?: string;
  profession?: string;
  birthday?: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
