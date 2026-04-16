import { UserRole } from '../interfaces/user.interface';

export class CreateUserDto {
  username: string;
  email?: string;
  fullname?: string;
  password?: string;
  role?: UserRole | string;
  profession?: string;
  avatar?: string;
}
