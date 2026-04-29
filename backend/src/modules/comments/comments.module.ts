import { Module } from '@nestjs/common';
import { CommentsController } from './controllers/comments.controller';
import { NotificationsModule } from '../notifications/presentation/notifications.module';
import { PostsModule } from '../posts/posts.module';
import { PrismaCommentRepository } from './repositories/prisma-comment.repository';
import { I_COMMENTS_REPOSITORY } from './domain/comment.repository.interface';

// Use Cases
import { GetCommentsByPostUseCase } from './services/get-comments-by-post.use-case';
import { CreateCommentUseCase } from './services/create-comment.use-case';
import { UpdateCommentUseCase } from './services/update-comment.use-case';
import { DeleteCommentUseCase } from './services/delete-comment.use-case';

@Module({
  imports: [NotificationsModule, PostsModule],
  controllers: [CommentsController],
  providers: [
    {
      provide: I_COMMENTS_REPOSITORY,
      useClass: PrismaCommentRepository,
    },
    GetCommentsByPostUseCase,
    CreateCommentUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
  ],
  exports: [I_COMMENTS_REPOSITORY],
})
export class CommentsModule {}
