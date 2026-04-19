import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/comment.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { User } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(data: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: data.post_id },
    });
    if (!post) throw new NotFoundException('Post not found');

    if (data.user_id) {
      const user = await this.prisma.user.findUnique({
        where: { id: data.user_id },
      });
      if (user && !user.can_comment) {
        throw new ForbiddenException(
          'Tài khoản của bạn đã bị cấm bình luận. Vui lòng liên hệ Admin để được mở khóa',
        );
      }
    }

    const comment = await this.prisma.comment.create({
      data: {
        post_id: data.post_id,
        user_id: data.user_id,
        parent_id: data.parent_id,
        author_name: data.author_name,
        author_email: data.author_email,
        content: data.content,
      },
      include: {
        User: {
          select: { id: true, fullname: true, username: true }
        }
      }
    });

    // --- TRIGGER NOTIFICATIONS ---
    try {
      const commenterName = comment.User?.fullname || comment.author_name || 'Ai đó';
      
      if (comment.parent_id) {
        // REPLY case: Notify parent comment author
        const parentComment = await this.prisma.comment.findUnique({
          where: { id: comment.parent_id },
          select: { user_id: true }
        });
        
        if (parentComment?.user_id && parentComment.user_id !== comment.user_id) {
          await this.notificationsService.create({
            recipient_id: parentComment.user_id,
            sender_id: comment.user_id || undefined,
            type: 'REPLY_TO_COMMENT',
            title: 'Phản hồi mới',
            content: `${commenterName} đã phản hồi bình luận của bạn`,
            link: `/posts/${post.slug}#comment-${comment.id}`,
          });
        }
      } else {
        // NEW COMMENT case: Notify post author
        if (post.author_id && post.author_id !== comment.user_id) {
          await this.notificationsService.create({
            recipient_id: post.author_id,
            sender_id: comment.user_id || undefined,
            type: 'COMMENT_ON_POST',
            title: 'Bình luận mới',
            content: `${commenterName} đã bình luận về bài viết "${post.title}"`,
            link: `/posts/${post.slug}#comment-${comment.id}`,
          });
        }
      }
    } catch (err) {
      console.error('Failed to trigger notification:', err);
      // Don't fail the comment creation if notification fails
    }

    return comment;
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

    if (!(user as any).can_comment) {
      throw new ForbiddenException('Tài khoản của bạn đã bị cấm bình luận. Vui lòng liên hệ Admin để được mở khóa');
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
