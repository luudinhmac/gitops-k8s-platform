import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PostsRepository {
  constructor(public prisma: PrismaService) {}

  async findMany(params: Record<string, any>) {
    return this.prisma.post.findMany(params as any);
  }

  async findUnique(params: Record<string, any>) {
    return this.prisma.post.findUnique(params as any);
  }

  async findFirst(params: Record<string, any>) {
    return this.prisma.post.findFirst(params as any);
  }

  async create(params: Record<string, any>) {
    return this.prisma.post.create(params as any);
  }

  async update(params: Record<string, any>) {
    return this.prisma.post.update(params as any);
  }

  async delete(params: Record<string, any>) {
    return this.prisma.post.delete(params as any);
  }

  async count(params: Record<string, any>) {
    return this.prisma.post.count(params as any);
  }
}
