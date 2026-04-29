import { Module } from '@nestjs/common';
import { PostsController } from './controllers/posts.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UploadModule } from '../upload/upload.module';
import { NotificationsModule } from '../notifications/presentation/notifications.module';
import { AdminAlertModule } from '../admin-alert/admin-alert.module';
import { PrismaPostRepository } from './repositories/prisma-post.repository';
import { I_POST_REPOSITORY } from './domain/post.repository.interface';
import { StorageModule } from '../../infrastructure/storage/storage.module';

// Use Cases
import { GetPostsUseCase } from './services/get-posts.use-case';
import { GetPostUseCase } from './services/get-post.use-case';
import { CreatePostUseCase } from './services/create-post.use-case';
import { UpdatePostUseCase } from './services/update-post.use-case';
import { DeletePostUseCase } from './services/delete-post.use-case';
import { TogglePinPostUseCase } from './services/toggle-pin-post.use-case';
import { TogglePublishPostUseCase } from './services/toggle-publish-post.use-case';
import { ToggleLikePostUseCase } from './services/toggle-like-post.use-case';
import { GetLikeStatusUseCase } from './services/get-like-status.use-case';


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
