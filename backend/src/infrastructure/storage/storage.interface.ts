export interface StorageFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface IStorageService {
  uploadFile(file: StorageFile, folder?: string): Promise<string>;
  deleteFile(fileKey: string): Promise<void>;
  getFileUrl(fileKey: string): string;
}

export const STORAGE_SERVICE = 'STORAGE_SERVICE';
