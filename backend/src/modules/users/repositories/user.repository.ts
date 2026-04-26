import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IUsersRepository } from './user.repository.interface';
import { UserEntity } from '../domain/user.entity';
import { CreateUserDto, UpdateUserDto } from '@portfolio/contracts';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}

  private handleError(error: any) {
    if (error.code === 'P2002') {
      throw new Error('User already exists');
    }
    throw error;
  }

  async findAll(params?: any): Promise<UserEntity[]> {
    return this.prisma.user.findMany(params) as any;
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { _count: { select: { Posts: true } } },
    }) as any;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({ where: { username } }) as any;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    // email is not @unique in schema, use findFirst
    return this.prisma.user.findFirst({ where: { email } }) as any;
  }

  async create(data: CreateUserDto): Promise<UserEntity> {
    try {
      return await this.prisma.user.create({ data: data as any }) as any;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async update(id: number, data: UpdateUserDto): Promise<UserEntity> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: data as any,
      }) as any;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.prisma.user.count({ where });
  }
}
