import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CommentsModule } from './modules/comments/comments.module';
import { UploadModule } from './modules/upload/upload.module';
import { SeriesModule } from './modules/series/series.module';
import { SettingsModule } from './modules/settings/settings.module';
<<<<<<< HEAD
import { TelegramModule } from './telegram/telegram.module';
import { MailModule } from './mail/mail.module';
import { TeamsModule } from './teams/teams.module';
import { AdminAlertModule } from './admin-alert/admin-alert.module';
=======
import { TelegramModule } from './modules/telegram/telegram.module';
import { MailModule } from './modules/mail/mail.module';
import { TeamsModule } from './modules/teams/teams.module';
import { AdminAlertModule } from './modules/admin-alert/admin-alert.module';
>>>>>>> feature/arch-refactor
import { ScheduleModule } from '@nestjs/schedule';
import { StatsModule } from './modules/stats/stats.module';
import { StatsMiddleware } from './modules/stats/stats.middleware';
import { HealthController } from './health.controller';
import { StorageModule } from './infrastructure/storage/storage.module';

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
    StorageModule,
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
  controllers: [HealthController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(StatsMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
