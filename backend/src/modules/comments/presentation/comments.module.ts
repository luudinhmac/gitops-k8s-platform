import { Module } from '@nestjs/common';
import { CommentsController } from './controllers/comments.controller';
import { NotificationsModule } from '../../notifications/presentation/notifications.module';
import { PostsModule } from '../../posts/presentation/posts.module';
import { PrismaCommentRepository } from '../infrastructure/repositories/prisma-comment.repository';
import { I_COMMENTS_REPOSITORY } from '../domain/repositories/comment.repository.interface';

// Use Cases
import { GetCommentsByPostUseCase } from '../application/use-cases/get-comments-by-post.use-case';
import { CreateCommentUseCase } from '../application/use-cases/create-comment.use-case';
import { UpdateCommentUseCase } from '../application/use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from '../application/use-cases/delete-comment.use-case';

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
