import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ICommentsRepository, I_COMMENTS_REPOSITORY } from '../../domain/repositories/comment.repository.interface';
import { I_POST_REPOSITORY, IPostRepository } from '../../../posts/domain/repositories/post.repository.interface';
import { CreateCommentDto, User, Comment } from '@portfolio/types';
import { NotificationsService } from '../../../notifications/notifications.service';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    @Inject(I_COMMENTS_REPOSITORY)
    private readonly commentRepository: ICommentsRepository,
    @Inject(I_POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async execute(data: CreateCommentDto, user?: User | null): Promise<Comment> {
    const post = await this.postRepository.findById(data.post_id);
    if (!post) throw new NotFoundException('Post not found');

    const userId = user?.id || undefined;
    let authorName = data.author_name;
    let authorEmail = data.author_email;

    if (user) {
      if (!user.can_comment) {
        throw new ForbiddenException('Tài khoản của bạn đã bị cấm bình luận.');
      }
      authorName = user.fullname || user.username || 'Thành viên';
      authorEmail = user.email || undefined;
    } else {
      authorName = authorName || 'Khách';
    }

    const comment = await this.commentRepository.create({
      ...data,
      user_id: userId,
      author_name: authorName,
      author_email: authorEmail,
    });

    // Notifications logic
    try {
      const commenterName = (comment as any).User?.fullname || comment.author_name || 'Ai đó';
      if (comment.parent_id) {
        const parentComment = await this.commentRepository.findById(comment.parent_id);
        if (parentComment?.user_id && parentComment.user_id !== userId) {
          await this.notificationsService.create({
            recipient_id: parentComment.user_id, 
            sender_id: userId, 
            type: 'REPLY_TO_COMMENT',
            title: 'Phản hồi mới', 
            content: `${commenterName} đã phản hồi bình luận của bạn`,
            link: `/posts/${post.slug}#comment-${comment.id}`,
          });
        }
      } else if (post.author_id && post.author_id !== userId) {
        await this.notificationsService.create({
          recipient_id: post.author_id, 
          sender_id: userId, 
          type: 'COMMENT_ON_POST',
          title: 'Bình luận mới', 
          content: `${commenterName} đã bình luận về bài viết "${post.title}"`,
          link: `/posts/${post.slug}#comment-${comment.id}`,
        });
      }
    } catch (err) { 
      console.error('Notification error:', err); 
    }

    return comment;
  }
}
