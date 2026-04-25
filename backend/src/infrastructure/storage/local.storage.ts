import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IStorageService, StorageFile } from './storage.interface';
import { InfrastructureConfigService } from '../config/config.service';

@Injectable()
export class LocalStorageService implements IStorageService {
  private readonly logger = new Logger(LocalStorageService.name);
  private readonly uploadDir: string;

  constructor(private readonly config: InfrastructureConfigService) {
    this.uploadDir = path.join(process.cwd(), this.config.uploadDir);
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: StorageFile, folder: string = ''): Promise<string> {
    const targetDir = path.join(this.uploadDir, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(targetDir, filename);

    await fs.promises.writeFile(filePath, file.buffer);
    
    const relativePath = folder ? `${folder}/${filename}` : filename;
    return `/uploads/${relativePath}`;
  }

  async deleteFile(fileKey: string): Promise<void> {
    if (!fileKey) return;

    // Handle both /uploads/filename and just filename
    const filename = fileKey.startsWith('/uploads/') 
      ? fileKey.replace('/uploads/', '') 
      : fileKey;
      
    const filePath = path.join(this.uploadDir, filename);

    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      this.logger.error(`Error deleting file ${fileKey}: ${error.message}`);
    }
  }

  getFileUrl(fileKey: string): string {
    if (fileKey.startsWith('http')) return fileKey;
    return fileKey.startsWith('/') ? fileKey : `/uploads/${fileKey}`;
  }
}
