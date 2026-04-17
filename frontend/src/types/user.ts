export type UserRole = 'admin' | 'editor' | 'user';

export interface User {
  id: number;
  username: string;
  email: string;
  fullname?: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  profession?: string;
  birthday?: string;
  created_at?: string;
  is_active?: boolean;
}
