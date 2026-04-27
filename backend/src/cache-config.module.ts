import { Global, Module } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Global()
@Module({
  providers: [
    {
      provide: CACHE_MANAGER,
      useValue: {
        get: async () => null,
        set: async () => {},
        del: async () => {},
        reset: async () => {},
        wrap: async (key, fn) => fn(),
        store: {
          get: async () => null,
          set: async () => {},
          del: async () => {},
        },
      },
    },
  ],
  exports: [CACHE_MANAGER],
})
export class CacheConfigModule {}
