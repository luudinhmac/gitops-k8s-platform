import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ICommentsRepository } from './comment.repository.interface';
import { CommentEntity } from '../domain/comment.entity';
import { CreateCommentDto } from '@portfolio/contracts';

@Injectable()
export class CommentsRepository implements ICommentsRepository {
  constructor(private prisma: PrismaService) {}

  private getSelect() {
    return {
      id: true, content: true, author_name: true, author_email: true,
      created_at: true, post_id: true, user_id: true, parent_id: true,
      User: { select: { fullname: true, avatar: true, username: true } },
    };
  }

  async findAll(postId: number): Promise<CommentEntity[]> {
    return this.prisma.comment.findMany({
      where: { post_id: postId },
      orderBy: { created_at: 'desc' },
      select: this.getSelect() as any,
    }) as any;
  }

  async findById(id: number): Promise<CommentEntity | null> {
    return this.prisma.comment.findUnique({
      where: { id },
      include: { Post: { select: { author_id: true, title: true } } },
    }) as any;
  }

  async create(data: CreateCommentDto & { user_id?: number }): Promise<CommentEntity> {
    return this.prisma.comment.create({
      data: {
        content: data.content,
        author_name: data.author_name,
        author_email: data.author_email,
        post_id: data.post_id,
        parent_id: data.parent_id,
        user_id: data.user_id,
      },
      select: this.getSelect() as any,
    }) as any;
  }

  async update(id: number, content: string): Promise<CommentEntity> {
    return this.prisma.comment.update({
      where: { id },
      data: { content },
      select: this.getSelect() as any,
    }) as any;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.comment.delete({ where: { id } });
  }

  async countByPostId(postId: number): Promise<number> {
    return this.prisma.comment.count({ where: { post_id: postId } });
  }
}
