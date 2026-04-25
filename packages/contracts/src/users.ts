export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

export interface User {
  id: number;
  username: string;
  email?: string;
  fullname?: string;
  password?: string;
  avatar?: string;
  profession?: string;
  role: UserRole | string;
  phone?: string;
  birthday?: string;
  address?: string;
  is_active: boolean;
  can_comment: boolean;
  can_post: boolean;
  created_at: Date | string;
}
