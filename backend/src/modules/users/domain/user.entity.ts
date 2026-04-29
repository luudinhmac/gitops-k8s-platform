import { UserRole } from '@portfolio/contracts';

export class UserEntity {
  id!: number;
  username!: string;
  email!: string;
  password?: string;
  fullname?: string | null;
  avatar?: string | null;
  role!: UserRole;
  is_active!: boolean;
  phone?: string | null;
  profession?: string | null;
  address?: string | null;
  birthday?: Date | null;
  bio?: string | null;
  social_links?: any;
  last_login?: Date | null;
  created_at!: Date;
  updated_at!: Date;
  can_comment!: boolean;
  can_post!: boolean;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
    
    if (typeof this.created_at === 'string') this.created_at = new Date(this.created_at);
    if (typeof this.updated_at === 'string') this.updated_at = new Date(this.updated_at);
    if (typeof this.birthday === 'string') this.birthday = new Date(this.birthday);
    if (typeof this.last_login === 'string') this.last_login = new Date(this.last_login);
  }

  public isAdmin(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.SUPERADMIN;
  }

  public toJSON() {
    const { password, ...result } = this;
    return result;
  }
}
