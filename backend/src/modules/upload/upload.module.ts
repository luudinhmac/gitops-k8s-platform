import { Module, Global } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { FileService } from './file.service';
import { MediaManagerService } from './media-manager.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { StorageModule } from '../../infrastructure/storage/storage.module';

@Global()
@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [UploadController],
  providers: [FileService, MediaManagerService],
  exports: [FileService, MediaManagerService],
})
export class UploadModule {}
