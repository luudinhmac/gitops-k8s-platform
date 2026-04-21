import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { UploadModule } from './upload/upload.module';
import { SeriesModule } from './series/series.module';
import { SettingsModule } from './settings/settings.module';
import { TelegramModule } from './telegram/telegram.module';
import { MailModule } from './mail/mail.module';
import { TeamsModule } from './teams/teams.module';
import { AdminAlertModule } from './admin-alert/admin-alert.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StatsModule } from './stats/stats.module';
import { StatsMiddleware } from './stats/stats.middleware';
import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PostsModule,
    NotificationsModule,
    CategoriesModule,
    CommentsModule,
    UploadModule,
    SeriesModule,
    SettingsModule,
    TelegramModule,
    MailModule,
    TeamsModule,
    AdminAlertModule,
    ScheduleModule.forRoot(),
    StatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(StatsMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
