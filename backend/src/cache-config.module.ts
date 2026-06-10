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
        const store = await redisStore({
          socket: {
            host: configService.redisHost,
            port: configService.redisPort,
          },
          password: configService.redisPassword || undefined,
          ttl: 600000, // 10 minutes (600,000 milliseconds)
        });
        return { store };
      },
      inject: [InfrastructureConfigService],
    }),
  ],
  exports: [CacheModule],
})
export class CacheConfigModule {}
