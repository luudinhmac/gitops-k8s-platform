import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findMany(params: Record<string, any>) {
    return this.prisma.user.findMany(params as any);
  }

  async findUnique(params: Record<string, any>) {
    return this.prisma.user.findUnique(params as any);
  }

  async create(params: Record<string, any>) {
    return this.prisma.user.create(params as any);
  }

  async update(params: Record<string, any>) {
    return this.prisma.user.update(params as any);
  }

  async delete(params: Record<string, any>) {
    return this.prisma.user.delete(params as any);
  }

  async count(params: Record<string, any>) {
    return this.prisma.user.count(params as any);
  }
}
