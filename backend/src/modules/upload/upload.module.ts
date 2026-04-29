import { Module, Global } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { FileService } from './file.service';
import { MediaManagerService } from './media-manager.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [UploadController],
  providers: [FileService, MediaManagerService],
  exports: [FileService, MediaManagerService],
})
export class UploadModule {}
