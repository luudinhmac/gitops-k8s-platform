import { Request } from 'express';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

export interface User {
  id: number;
  username: string;
  email?: string;
  fullname?: string;
  password?: string; // Add password to User interface if needed for casting or separate it
  avatar?: string;
  profession?: string;
  role: UserRole | string;
  phone?: string;
  birthday?: string;
  address?: string;
  is_active: boolean;
  can_comment: boolean;
  can_post: boolean;
  created_at: Date;
}

export interface AuthenticatedRequest extends Request {
  user: User;
}
