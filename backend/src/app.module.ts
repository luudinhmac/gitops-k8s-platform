import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/presentation/users.module';
import { PostsModule } from './modules/posts/presentation/posts.module';
import { NotificationsModule } from './modules/notifications/presentation/notifications.module';
import { CategoriesModule } from './modules/categories/presentation/categories.module';
import { CommentsModule } from './modules/comments/presentation/comments.module';
import { UploadModule } from './modules/upload/upload.module';
import { SeriesModule } from './modules/series/presentation/series.module';
import { SettingsModule } from './modules/settings/settings.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { MailModule } from './modules/mail/mail.module';
import { TeamsModule } from './modules/teams/teams.module';
import { AdminAlertModule } from './modules/admin-alert/admin-alert.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StatsModule } from './modules/stats/stats.module';
import { StatsMiddleware } from './modules/stats/stats.middleware';
import { HealthController } from './health.controller';
import { StorageModule } from './infrastructure/storage/storage.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

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
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60, // 60 requests per minute
    }]),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        if (process.env.REDIS_URL) {
          return {
            store: await redisStore({
              url: process.env.REDIS_URL,
              ttl: 600, // 10 minutes
            }),
          };
        }
        return {
          ttl: 600, // 10 minutes (memory)
        };
      },
    }),
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(StatsMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
