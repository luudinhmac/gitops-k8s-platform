import {
  Injectable,
  NotFoundException,
  ForbiddenException,
<<<<<<< HEAD
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from './dto/comment.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { AdminAlertService } from '../../admin-alert/admin-alert.service';
import { User } from '@prisma/client';
=======
  Inject,
} from '@nestjs/common';
import { CreateCommentDto, User, UserRole } from '@portfolio/contracts';
import { NotificationsService } from '../notifications/notifications.service';
import { AdminAlertService } from '../admin-alert/admin-alert.service';
import { ICommentsRepository, I_COMMENTS_REPOSITORY } from './repositories/comment.repository.interface';
import { I_POSTS_REPOSITORY, IPostsRepository } from '../posts/repositories/post.repository.interface';
>>>>>>> feature/arch-refactor

@Injectable()
export class CommentsService {
  constructor(
<<<<<<< HEAD
    private prisma: PrismaService,
=======
    @Inject(I_COMMENTS_REPOSITORY) private repository: ICommentsRepository,
    @Inject(I_POSTS_REPOSITORY) private postsRepository: IPostsRepository,
>>>>>>> feature/arch-refactor
    private notificationsService: NotificationsService,
    private adminAlertService: AdminAlertService,
  ) {}

  async create(data: CreateCommentDto, user?: User | null) {
<<<<<<< HEAD
    const post = await this.prisma.post.findUnique({
      where: { id: data.post_id },
    });
    if (!post) throw new NotFoundException('Post not found');

    const userId = user?.id || null;
=======
    const post = await this.postsRepository.findById(data.post_id);
    if (!post) throw new NotFoundException('Post not found');

    const userId = user?.id || undefined;
>>>>>>> feature/arch-refactor
    let authorName = data.author_name;
    let authorEmail = data.author_email;

    if (user) {
      if (!user.can_comment) {
<<<<<<< HEAD
        throw new ForbiddenException(
          'Tài khoản của bạn đã bị cấm bình luận. Vui lòng liên hệ Admin để được mở khóa',
        );
=======
        throw new ForbiddenException('Tài khoản của bạn đã bị cấm bình luận.');
>>>>>>> feature/arch-refactor
      }
      authorName = user.fullname || user.username || 'Thành viên';
      authorEmail = user.email || undefined;
    } else {
<<<<<<< HEAD
      // Guest logic
      authorName = authorName || 'Khách';
    }

    const comment = await this.prisma.comment.create({
      data: {
        post_id: data.post_id,
        user_id: userId,
        parent_id: data.parent_id,
        author_name: authorName,
        author_email: authorEmail,
        content: data.content,
      },
      include: {
        User: {
          select: { id: true, fullname: true, username: true, avatar: true }
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
        
        if (parentComment?.user_id && parentComment.user_id !== userId) {
          await this.notificationsService.create({
            recipient_id: parentComment.user_id,
            sender_id: userId || undefined,
            type: 'REPLY_TO_COMMENT',
            title: 'Phản hồi mới',
            content: `${commenterName} đã phản hồi bình luận của bạn`,
            link: `/posts/${post.slug}#comment-${comment.id}`,
          });
        }
      } else {
        // NEW COMMENT case: Notify post author
        if (post.author_id && post.author_id !== userId) {
          await this.notificationsService.create({
            recipient_id: post.author_id,
            sender_id: userId || undefined,
            type: 'COMMENT_ON_POST',
            title: 'Bình luận mới',
            content: `${commenterName} đã bình luận về bài viết "${post.title}"`,
            link: `/posts/${post.slug}#comment-${comment.id}`,
          });
        }
      }
    } catch (err) {
      console.error('Failed to trigger notification:', err);
    }
=======
      authorName = authorName || 'Khách';
    }

    const comment = await this.repository.create({
      ...data,
      user_id: userId,
      author_name: authorName,
      author_email: authorEmail,
    });

    // Notifications logic
    try {
      const commenterName = (comment as any).User?.fullname || comment.author_name || 'Ai đó';
      if (comment.parent_id) {
        const parentComment = await this.repository.findById(comment.parent_id);
        if (parentComment?.user_id && parentComment.user_id !== userId) {
          await this.notificationsService.create({
            recipient_id: parentComment.user_id, sender_id: userId, type: 'REPLY_TO_COMMENT',
            title: 'Phản hồi mới', content: `${commenterName} đã phản hồi bình luận của bạn`,
            link: `/posts/${post.slug}#comment-${comment.id}`,
          });
        }
      } else if (post.author_id && post.author_id !== userId) {
        await this.notificationsService.create({
          recipient_id: post.author_id, sender_id: userId, type: 'COMMENT_ON_POST',
          title: 'Bình luận mới', content: `${commenterName} đã bình luận về bài viết "${post.title}"`,
          link: `/posts/${post.slug}#comment-${comment.id}`,
        });
      }
    } catch (err) { console.error('Notification error:', err); }
>>>>>>> feature/arch-refactor

    return comment;
  }

  async findByPost(postId: number) {
<<<<<<< HEAD
    const comments = await this.prisma.comment.findMany({
      where: { post_id: postId },
      include: {
        User: {
          select: {
            id: true,
            fullname: true,
            avatar: true,
            username: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    // Build comment tree in backend
    const map = new Map<number, any>();
    const roots: any[] = [];

    comments.forEach(c => {
      map.set(c.id, { ...c, Replies: [] });
    });

=======
    const comments = await this.repository.findAll(postId);
    
    // Build tree
    const map = new Map<number, any>();
    const roots: any[] = [];

    comments.forEach(c => map.set(c.id, { ...c, Replies: [] }));
>>>>>>> feature/arch-refactor
    comments.forEach(c => {
      const node = map.get(c.id);
      if (!node) return;
      if (c.parent_id) {
        const parent = map.get(c.parent_id);
<<<<<<< HEAD
        if (parent) {
          parent.Replies.push(node);
        } else {
          roots.push(node);
        }
=======
        if (parent) parent.Replies.push(node);
        else roots.push(node);
>>>>>>> feature/arch-refactor
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  async update(id: number, content: string, user: User) {
<<<<<<< HEAD
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
=======
    const comment = await this.repository.findById(id);
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.user_id !== user.id) throw new ForbiddenException('You can only edit your own comments');
    if (!user.can_comment) throw new ForbiddenException('Tài khoản bị cấm bình luận.');

    return this.repository.update(id, content);
  }

  async remove(id: number, user: User) {
    const comment = await this.repository.findById(id);
    if (!comment) throw new NotFoundException('Comment not found');
    if (user.role !== UserRole.ADMIN && comment.user_id !== user.id) {
      throw new ForbiddenException('You do not have permission to delete this comment');
    }
    return this.repository.delete(id);
>>>>>>> feature/arch-refactor
  }
}
