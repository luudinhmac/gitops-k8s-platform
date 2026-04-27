import { UserEntity } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '@portfolio/types';

export const I_USERS_REPOSITORY = 'I_USERS_REPOSITORY';

export interface IUsersRepository {
  findAll(params?: any): Promise<UserEntity[]>;
  findById(id: number): Promise<UserEntity | null>;
  findByUsername(username: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(data: CreateUserDto): Promise<UserEntity>;
  update(id: number, data: UpdateUserDto): Promise<UserEntity>;
  delete(id: number): Promise<void>;
  count(where?: any): Promise<number>;
}
