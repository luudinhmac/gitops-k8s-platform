import { Module } from '@nestjs/common';
import { PostsController } from './controllers/posts.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { UploadModule } from '../../upload/upload.module';
import { NotificationsModule } from '../../notifications/presentation/notifications.module';
import { AdminAlertModule } from '../../admin-alert/admin-alert.module';
import { PrismaPostRepository } from '../infrastructure/repositories/prisma-post.repository';
import { I_POST_REPOSITORY } from '../domain/repositories/post.repository.interface';
import { StorageModule } from '../../../infrastructure/storage/storage.module';

// Use Cases
import { GetPostsUseCase } from '../application/use-cases/get-posts.use-case';
import { GetPostUseCase } from '../application/use-cases/get-post.use-case';
import { CreatePostUseCase } from '../application/use-cases/create-post.use-case';
import { UpdatePostUseCase } from '../application/use-cases/update-post.use-case';
import { DeletePostUseCase } from '../application/use-cases/delete-post.use-case';
import { TogglePinPostUseCase } from '../application/use-cases/toggle-pin-post.use-case';
import { TogglePublishPostUseCase } from '../application/use-cases/toggle-publish-post.use-case';
import { ToggleLikePostUseCase } from '../application/use-cases/toggle-like-post.use-case';
import { GetLikeStatusUseCase } from '../application/use-cases/get-like-status.use-case';

@Module({
  imports: [
    PrismaModule,
    UploadModule,
    NotificationsModule,
    AdminAlertModule,
    StorageModule,
  ],
  controllers: [PostsController],
  providers: [
    {
      provide: I_POST_REPOSITORY,
      useClass: PrismaPostRepository,
    },
    GetPostsUseCase,
    GetPostUseCase,
    CreatePostUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    TogglePinPostUseCase,
    TogglePublishPostUseCase,
    ToggleLikePostUseCase,
    GetLikeStatusUseCase,
  ],
  exports: [
    I_POST_REPOSITORY,
    GetPostsUseCase,
    GetPostUseCase,
  ],
})
export class PostsModule {}
