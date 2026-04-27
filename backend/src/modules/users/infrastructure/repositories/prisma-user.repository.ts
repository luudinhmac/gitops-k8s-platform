import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IUsersRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { CreateUserDto, UpdateUserDto } from '@portfolio/types';

@Injectable()
export class PrismaUserRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params?: any): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany(params);
    return users.map(user => UserMapper.toDomain(user) as UserEntity);
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return UserMapper.toDomain(user);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    return UserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return UserMapper.toDomain(user);
  }

  async create(data: CreateUserDto): Promise<UserEntity> {
    const user = await this.prisma.user.create({ data: data as any });
    return UserMapper.toDomain(user) as UserEntity;
  }

  async update(id: number, data: UpdateUserDto): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data: data as any,
    });
    return UserMapper.toDomain(user) as UserEntity;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.prisma.user.count({ where });
  }
}
