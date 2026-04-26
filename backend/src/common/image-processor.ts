import sharp from 'sharp';

export type ImageType = 'avatar' | 'post' | 'content';

export class ImageProcessor {
  static async process(buffer: Buffer, type: ImageType): Promise<Buffer> {
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

    return transformer.toBuffer();
  }

  static getExtension(): string {
    return 'webp';
  }

  static getMimeType(): string {
    return 'image/webp';
  }
}
