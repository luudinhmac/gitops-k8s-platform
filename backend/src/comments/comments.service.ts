import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/comment.dto';
import { User } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: data.post_id },
    });
    if (!post) throw new NotFoundException('Post not found');

    return this.prisma.comment.create({
      data: {
        post_id: data.post_id,
        user_id: data.user_id,
        author_name: data.author_name,
        author_email: data.author_email,
        content: data.content,
      },
    });
  }

  async findByPost(postId: number) {
    return this.prisma.comment.findMany({
      where: { post_id: postId },
      include: {
        User: {
          select: {
            id: true,
            fullname: true,
            avatar: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async update(id: number, content: string, user: User) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) throw new NotFoundException('Comment not found');

    // Only author can edit
    if (comment.user_id !== user.id) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    return this.prisma.comment.update({
      where: { id },
      data: { content },
    });
  }

  async remove(id: number, user: User) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) throw new NotFoundException('Comment not found');

    // Admin or author can delete
    if (user.role !== 'admin' && comment.user_id !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to delete this comment',
      );
    }

    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
