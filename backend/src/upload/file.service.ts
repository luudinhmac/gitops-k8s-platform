import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import sharp from 'sharp';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
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
   * Processes and saves a file to the uploads directory
   * Returns the relative path /uploads/filename
   */
  async saveFile(
    buffer: Buffer,
    filename: string,
    type: 'avatar' | 'post' | 'content' = 'content',
  ): Promise<string> {
    const filePath = path.join(this.uploadDir, filename);

    // Deduplication: if file already exists with same hash name, we don't need to process/write it again
    if (fs.existsSync(filePath)) {
      this.logger.log(`File already exists (deduplicated): ${filename}`);
      return `/uploads/${filename}`;
    }

    try {
      let transformer = sharp(buffer).webp({ quality: 80 });

      if (type === 'avatar') {
        // Avatars should be small and square
        transformer = transformer.resize(400, 400, {
          fit: 'cover',
          position: 'center',
        });
      } else if (type === 'post') {
        // Post covers should be optimized for wide displays but not huge
        transformer = transformer.resize(1920, null, {
          withoutEnlargement: true,
          fit: 'inside',
        });
      } else {
        // General post content: decent quality, reasonable size
        transformer = transformer.resize(1600, null, {
          withoutEnlargement: true,
          fit: 'inside',
        });
      }

      await transformer.toFile(filePath);
      this.logger.log(`File processed and saved (${type}): ${filename}`);
    } catch (error) {
      this.logger.error(`Error processing image ${filename}: ${error.message}`);
      // Fallback: save original buffer if sharp fails (unlikely for matched images)
      await fs.promises.writeFile(filePath, buffer);
    }

    return `/uploads/${filename}`;
  }

  /**
   * Deletes a file from the uploads directory
   */
  async deleteFile(fileUrl: string): Promise<boolean> {
    if (!fileUrl) return false;

    // Extract filename from URL (handles both absolute and relative paths)
    const uploadsPrefix = '/uploads/';
    const index = fileUrl.indexOf(uploadsPrefix);
    if (index === -1) return false;

    const filename = fileUrl.substring(index + uploadsPrefix.length);
    const filePath = path.join(this.uploadDir, filename);

    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        this.logger.log(`File deleted: ${filename}`);
        return true;
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error deleting file ${filename}: ${msg}`);
    }
    return false;
  }
}
