export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

export interface User {
  id: number;
  username: string;
  email?: string | null;
  fullname?: string | null;
  password?: string;
  avatar?: string | null;
  profession?: string | null;
  role: UserRole | string;
  phone?: string | null;
  birthday?: string | null;
  address?: string | null;
  is_active: boolean;
  can_comment: boolean;
  can_post: boolean;
  created_at: Date | string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password?: string | null;
  fullname?: string | null;
  role?: string | null;
  profession?: string | null;
  phone?: string | null;
  birthday?: string | null;
  address?: string | null;
  is_active?: boolean;
}

export interface UpdateUserDto {
  email?: string | null;
  password?: string | null;
  fullname?: string | null;
  role?: string | null;
  profession?: string | null;
  avatar?: string | null;
  phone?: string | null;
  birthday?: string | null;
  address?: string | null;
  is_active?: boolean;
  can_comment?: boolean;
  can_post?: boolean;
}
