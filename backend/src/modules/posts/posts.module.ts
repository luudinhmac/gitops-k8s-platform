import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UploadModule } from '../upload/upload.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AdminAlertModule } from '../admin-alert/admin-alert.module';
import { PostsRepository } from './repositories/post.repository';
import { I_POSTS_REPOSITORY } from './repositories/post.repository.interface';
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
  providers: [
    PostsService,
    {
      provide: I_POSTS_REPOSITORY,
      useClass: PostsRepository,
    },
  ],
  exports: [PostsService, I_POSTS_REPOSITORY],
})
export class PostsModule {}
