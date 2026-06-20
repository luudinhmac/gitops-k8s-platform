import { Injectable, Logger, Inject } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import sharp from 'sharp';
import { IStorageService, STORAGE_SERVICE } from '../../infrastructure/storage/storage.interface';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor(
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
  ) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Generates a unique filename based on buffer content (hash) + .webp extension
   */
  generateHashFilename(buffer: Buffer): string {
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    return `${hash}.webp`;
  }

  /**
   * Processes and saves a file to the active storage service
   * Returns the file URL (absolute CDN/Endpoint or local path)
   */
  async saveFile(
    buffer: Buffer,
    filename: string,
    type: 'avatar' | 'post' | 'content' = 'content',
  ): Promise<string> {
    let processedBuffer: Buffer;
    try {
      let transformer = sharp(buffer).webp({ quality: 80 });

      if (type === 'avatar') {
        transformer = transformer.resize(400, 400, {
          fit: 'cover',
          position: 'center',
        });
      } else if (type === 'post') {
        transformer = transformer.resize(1920, null, {
          withoutEnlargement: true,
          fit: 'inside',
        });
      } else {
        transformer = transformer.resize(1600, null, {
          withoutEnlargement: true,
          fit: 'inside',
        });
      }

      processedBuffer = await transformer.toBuffer();
      this.logger.log(`File processed successfully (${type}): ${filename}`);
    } catch (error) {
      this.logger.error(`Error processing image ${filename}: ${error.message}`);
      processedBuffer = buffer;
    }

    const storagePath = await this.storageService.uploadFile(
      {
        fieldname: 'file',
        originalname: filename,
        encoding: '7bit',
        mimetype: 'image/webp',
        buffer: processedBuffer,
        size: processedBuffer.length,
      },
      type,
    );

    const fileUrl = this.storageService.getFileUrl(storagePath);
    this.logger.log(`File saved and URL generated: ${fileUrl}`);
    return fileUrl;
  }

  /**
   * Deletes a file from the active storage service
   */
  async deleteFile(fileUrl: string): Promise<boolean> {
    if (!fileUrl) return false;
    try {
      await this.storageService.deleteFile(fileUrl);
      this.logger.log(`File deleted successfully via storage service: ${fileUrl}`);
      return true;
    } catch (error) {
      this.logger.error(`Error deleting file ${fileUrl}: ${error.message}`);
      return false;
    }
  }
}
