import { Injectable } from '@nestjs/common';

@Injectable()
export class InfrastructureConfigService {
  get storageType(): 'local' | 'minio' {
    return (process.env.STORAGE_TYPE as 'local' | 'minio') || 'local';
  }

  get uploadDir(): string {
    return process.env.UPLOAD_DIR || 'uploads';
  }

  get minioEndpoint(): string {
    return process.env.MINIO_ENDPOINT || 'localhost';
  }

  get minioPort(): number {
    return parseInt(process.env.MINIO_PORT || '9000', 10);
  }

  get minioAccessKey(): string {
    return process.env.MINIO_ACCESS_KEY || '';
  }

  get minioSecretKey(): string {
    return process.env.MINIO_SECRET_KEY || '';
  }

  get minioBucket(): string {
    return process.env.MINIO_BUCKET || 'portfolio';
  }

  get minioUseSSL(): boolean {
    return process.env.MINIO_USE_SSL === 'true';
  }
}
