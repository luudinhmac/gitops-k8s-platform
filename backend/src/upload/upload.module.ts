import { Module, Global } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { FileService } from './file.service';

@Global()
@Module({
  controllers: [UploadController],
  providers: [FileService],
  exports: [FileService],
})
export class UploadModule {}
