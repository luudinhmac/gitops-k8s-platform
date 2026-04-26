import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { FileService } from './file.service';

@Controller('upload')
@UseGuards(AuthGuard('jwt'))
export class UploadController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return cb(
            new BadRequestException('Chỉ chấp nhận file định dạng hình ảnh!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // Increased to 10MB to handle high-res originals before compression
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type: 'avatar' | 'post' | 'content' = 'content',
  ) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file');
    }

    // Generate filename based on hash of content
    const filename = this.fileService.generateHashFilename(file.buffer);

    // Save file using service (handles resizing, conversion and deduplication)
    const url = await this.fileService.saveFile(file.buffer, filename, type);

    return {
      success: true,
      url: url,
    };
  }
}
