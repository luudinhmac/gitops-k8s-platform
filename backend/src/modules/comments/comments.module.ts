import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AdminAlertModule } from '../admin-alert/admin-alert.module';
import { CommentsRepository } from './repositories/comment.repository';
import { I_COMMENTS_REPOSITORY } from './repositories/comment.repository.interface';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    PrismaModule, 
    NotificationsModule, 
    AdminAlertModule,
    PostsModule,
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    {
      provide: I_COMMENTS_REPOSITORY,
      useClass: CommentsRepository,
    },
  ],
  exports: [CommentsService, I_COMMENTS_REPOSITORY],
})
export class CommentsModule {}
