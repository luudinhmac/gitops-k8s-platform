import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';
import { IStorageService, StorageFile } from './storage.interface';
import { InfrastructureConfigService } from '../config/config.service';

@Injectable()
export class MinioStorageService implements IStorageService, OnModuleInit {
  private readonly logger = new Logger(MinioStorageService.name);
  private minioClient: Minio.Client;

  constructor(private readonly config: InfrastructureConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.config.minioEndpoint,
      port: this.config.minioPort,
      useSSL: this.config.minioUseSSL,
      accessKey: this.config.minioAccessKey,
      secretKey: this.config.minioSecretKey,
    });
  }

  async onModuleInit() {
    if (this.config.storageType !== 'minio') return;

    const bucket = this.config.minioBucket;
    try {
      const exists = await this.minioClient.bucketExists(bucket);
    if (!exists) {
      await this.minioClient.makeBucket(bucket);
      this.logger.log(`Created bucket: ${bucket}`);
      
      // Set public read policy for the bucket
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetBucketLocation', 's3:ListBucket'],
            Resource: [`arn:aws:s3:::${bucket}`],
          },
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${bucket}/*`],
          },
        ],
      };
      await this.minioClient.setBucketPolicy(bucket, JSON.stringify(policy));
    }
    } catch (error) {
      this.logger.error(`Failed to initialize MinIO bucket: ${error.message}`);
    }
  }

  async uploadFile(file: StorageFile, folder: string = ''): Promise<string> {
    const filename = `${Date.now()}-${file.originalname}`;
    const objectName = folder ? `${folder}/${filename}` : filename;

    await this.minioClient.putObject(
      this.config.minioBucket,
      objectName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype }
    );

    return objectName;
  }

  async deleteFile(fileKey: string): Promise<void> {
    if (!fileKey) return;
    
    // Extract object name if it's a URL
    const objectName = fileKey.includes('/') 
      ? fileKey.split('/').slice(-2).join('/') // Assuming folder/filename or just filename
      : fileKey;

    try {
      await this.minioClient.removeObject(this.config.minioBucket, objectName);
    } catch (error) {
      this.logger.error(`Error deleting minio object ${fileKey}: ${error.message}`);
    }
  }

  getFileUrl(fileKey: string): string {
    if (fileKey.startsWith('http')) return fileKey;
    
    const protocol = this.config.minioUseSSL ? 'https' : 'http';
    const endpoint = this.config.minioEndpoint;
    const port = this.config.minioPort;
    const bucket = this.config.minioBucket;
    
    return `${protocol}://${endpoint}:${port}/${bucket}/${fileKey}`;
  }
}
