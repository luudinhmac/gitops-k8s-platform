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
import { PrismaService } from '../../prisma/prisma.service';

@Controller('upload')
@UseGuards(AuthGuard('jwt'))
export class UploadController {
  private prisma: any;

  constructor(
    private readonly fileService: FileService,
    prisma: PrismaService,
  ) {
    this.prisma = prisma;
  }

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

    // Ensure Media record exists
    const hash = filename.split('.')[0];
    await this.prisma.media.upsert({
      where: { hash },
      update: {},
      create: {
        hash,
        path: url,
        size: file.size,
        mime_type: 'image/webp',
      }
    });

    return {
      success: true,
      url: url,
    };
  }
}
