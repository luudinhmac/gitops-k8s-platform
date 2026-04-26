import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UploadModule } from '../upload/upload.module';
import { NotificationsModule } from '../notifications/notifications.module';
<<<<<<< HEAD
import { AdminAlertModule } from '../../admin-alert/admin-alert.module';
import { PostsRepository } from './posts.repository';
=======
import { AdminAlertModule } from '../admin-alert/admin-alert.module';
import { PostsRepository } from './repositories/post.repository';
import { I_POSTS_REPOSITORY } from './repositories/post.repository.interface';
>>>>>>> feature/arch-refactor
import { StorageModule } from '../../infrastructure/storage/storage.module';

@Module({
  imports: [
    PrismaModule,
    UploadModule,
    NotificationsModule,
    AdminAlertModule,
    StorageModule,
  ],
  controllers: [PostsController],
<<<<<<< HEAD
  providers: [PostsService, PostsRepository],
  exports: [PostsService, PostsRepository],
=======
  providers: [
    PostsService,
    {
      provide: I_POSTS_REPOSITORY,
      useClass: PostsRepository,
    },
  ],
  exports: [PostsService, I_POSTS_REPOSITORY],
>>>>>>> feature/arch-refactor
})
export class PostsModule {}
