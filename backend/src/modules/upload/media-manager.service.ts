import { Injectable, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FileService } from './file.service';
import { IStorageService, STORAGE_SERVICE } from '../../infrastructure/storage/storage.interface';
import * as cheerio from 'cheerio';

@Injectable()
export class MediaManagerService {
  private readonly logger = new Logger(MediaManagerService.name);

  private prisma: any;

  constructor(
    prisma: PrismaService,
    private readonly fileService: FileService,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
  ) {
    this.prisma = prisma;
  }

  /**
   * Registers or updates a media usage for a specific entity field
   */
  async registerUsage(fileUrl: string, entityType: string, entityId: number, field: string) {
    if (!fileUrl) return;

    // 1. Get or create Media record
    const filename = this.extractFilename(fileUrl);
    if (!filename) return;

    const hash = filename.split('.')[0]; // Assuming hash.webp format

    let media = await this.prisma.media.findUnique({ where: { hash } });
    
    if (!media) {
      // If media record missing but file exists (migration case)
      media = await this.prisma.media.create({
        data: {
          hash,
          path: `/uploads/${filename}`,
        }
      });
    }

    // 2. Create or update MediaUsage
    await this.prisma.mediaUsage.upsert({
      where: {
        media_id_entity_type_entity_id_field: {
          media_id: media.id,
          entity_type: entityType,
          entity_id: entityId,
          field: field,
        }
      },
      update: {},
      create: {
        media_id: media.id,
        entity_type: entityType,
        entity_id: entityId,
        field: field,
      }
    });
  }

  /**
   * Unregisters a media usage. If no more usages exist, clean up.
   */
  async unregisterUsage(fileUrl: string, entityType: string, entityId: number, field: string) {
    if (!fileUrl) return;

    const filename = this.extractFilename(fileUrl);
    if (!filename) return;
    const hash = filename.split('.')[0];

    const media = await this.prisma.media.findUnique({ where: { hash } });
    if (!media) return;

    await this.prisma.mediaUsage.deleteMany({
      where: {
        media_id: media.id,
        entity_type: entityType,
        entity_id: entityId,
        field: field,
      }
    });

    await this.cleanupOrphanedMedia(media.id);
  }

  /**
   * Unregisters all usages for an entity (e.g. when deleting a post)
   */
  async unregisterAllForEntity(entityType: string, entityId: number) {
    const usages = await this.prisma.mediaUsage.findMany({
      where: { entity_type: entityType, entity_id: entityId }
    });

    const mediaIds: number[] = Array.from(new Set(usages.map((u: any) => u.media_id as number)));

    await this.prisma.mediaUsage.deleteMany({
      where: { entity_type: entityType, entity_id: entityId }
    });

    for (const mediaId of mediaIds) {
      await this.cleanupOrphanedMedia(mediaId);
    }
  }

  /**
   * Syncs media usages within HTML content
   */
  async syncContentUsages(entityType: string, entityId: number, htmlContent: string) {
    if (!htmlContent) {
      await this.unregisterUsageInField(entityType, entityId, 'content');
      return;
    }

    const $ = cheerio.load(htmlContent);
    const urls: string[] = [];
    
    $('img').each((_, element) => {
      const src = $(element).attr('src');
      if (src && src.includes('/uploads/')) {
        urls.push(src);
      }
    });

    // Deduplicate URLs in content
    const uniqueUrls = [...new Set(urls)];
    
    // Get current registered media for this content field
    const currentUsages = await this.prisma.mediaUsage.findMany({
      where: { entity_type: entityType, entity_id: entityId, field: 'content' },
      include: { Media: true }
    });

    const currentUrls = currentUsages.map(u => u.Media.path);

    // Diff
    const toAdd = uniqueUrls.filter(url => !currentUrls.includes(this.normalizeUrl(url)));
    const toRemove = currentUrls.filter(url => !uniqueUrls.map(u => this.normalizeUrl(u)).includes(url));

    // Remove old ones
    for (const url of toRemove) {
      await this.unregisterUsage(url, entityType, entityId, 'content');
    }

    // Add new ones
    for (const url of toAdd) {
      await this.registerUsage(url, entityType, entityId, 'content');
    }
  }

  private async unregisterUsageInField(entityType: string, entityId: number, field: string) {
    const usages = await this.prisma.mediaUsage.findMany({
      where: { entity_type: entityType, entity_id: entityId, field }
    });
    const mediaIds: number[] = usages.map((u: any) => u.media_id as number);

    await this.prisma.mediaUsage.deleteMany({
      where: { entity_type: entityType, entity_id: entityId, field }
    });

    for (const id of mediaIds) {
      await this.cleanupOrphanedMedia(id);
    }
  }

  private async cleanupOrphanedMedia(mediaId: number) {
    const usageCount = await this.prisma.mediaUsage.count({
      where: { media_id: mediaId }
    });

    if (usageCount === 0) {
      const media = await this.prisma.media.findUnique({ where: { id: mediaId } });
      if (media) {
        this.logger.log(`Cleaning up orphaned media: ${media.path}`);
        await this.storageService.deleteFile(media.path);
        await this.prisma.media.delete({ where: { id: mediaId } });
      }
    }
  }

  private extractFilename(url: string): string | null {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return filename || null;
  }

  private normalizeUrl(url: string): string {
    // Ensure it starts with /uploads/ and doesn't have domain
    const uploadsIdx = url.indexOf('/uploads/');
    if (uploadsIdx !== -1) {
      return url.substring(uploadsIdx);
    }
    return url;
  }
}
