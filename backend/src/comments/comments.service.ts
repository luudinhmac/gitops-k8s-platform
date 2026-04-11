import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { post_id: number; author_name: string; author_email?: string; content: string }) {
    const post = await this.prisma.post.findUnique({ where: { id: data.post_id } });
    if (!post) throw new NotFoundException('Post not found');

    return this.prisma.comment.create({
      data: {
        post_id: data.post_id,
        author_name: data.author_name,
        author_email: data.author_email,
        content: data.content,
      },
    });
  }

  async findByPost(postId: number) {
    return this.prisma.comment.findMany({
      where: { post_id: postId },
      orderBy: { created_at: 'desc' },
    });
  }
}
