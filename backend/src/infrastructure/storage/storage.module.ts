import { Module, Global } from '@nestjs/common';
import { STORAGE_SERVICE } from './storage.interface';
import { LocalStorageService } from './local.storage';
import { MinioStorageService } from './minio.storage';
import { InfrastructureConfigService } from '../config/config.service';

@Global()
@Module({
  providers: [
    InfrastructureConfigService,
    {
      provide: STORAGE_SERVICE,
      useFactory: (config: InfrastructureConfigService, local: LocalStorageService, minio: MinioStorageService) => {
        return config.storageType === 'minio' ? minio : local;
      },
      inject: [InfrastructureConfigService, LocalStorageService, MinioStorageService],
    },
    LocalStorageService,
    MinioStorageService,
  ],
  exports: [STORAGE_SERVICE, InfrastructureConfigService],
})
export class StorageModule {}
