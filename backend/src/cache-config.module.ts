import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { InfrastructureConfigService } from './infrastructure/config/config.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: InfrastructureConfigService) => {
        try {
          const store = await redisStore({
            socket: {
              host: configService.redisHost,
              port: configService.redisPort,
              connectTimeout: 3000,
            },
            password: configService.redisPassword || undefined,
            ttl: 600000, // 10 minutes (600,000 milliseconds)
          });

          // Register error event listener on client to prevent runtime crashes
          const client = store.client;
          if (client) {
            client.on('error', (err: any) => {
              console.error('Redis client error:', err.message || err);
            });
          }

          return { store };
        } catch (error: any) {
          console.warn('Could not initialize Redis cache store. Falling back to in-memory cache.', error.message || error);
          return {
            ttl: 600,
          };
        }
      },
      inject: [InfrastructureConfigService],
    }),
  ],
  exports: [CacheModule],
})
export class CacheConfigModule {}
