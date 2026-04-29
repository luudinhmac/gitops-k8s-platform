import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../../../prisma/prisma.service';
import { IPostRepository } from '../domain/post.repository.interface';
import { PostFilter, PaginationParams, PaginatedResult } from '../domain/post.types';
import { PostEntity } from '../domain/post.entity';
import { PostMapper } from '../mappers/post.mapper';
import { CreatePostDto, UpdatePostDto } from '@portfolio/contracts';
import { PostNotFoundException } from '../domain/post.errors';

@Injectable()
export class PrismaPostRepository implements IPostRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: PostFilter, pagination: PaginationParams): Promise<PaginatedResult<PostEntity>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    const viewerId = filter.viewer_id;
    const isPublicSearch = !viewerId;

    if (isPublicSearch) {
      where.is_published = true;
      where.is_blocked = false;
    } else {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { author_id: viewerId },
            { AND: [{ is_published: true }, { is_blocked: false }] },
            { is_blocked: true }
          ]
        }
      ];

      if (filter.is_published !== undefined) where.is_published = filter.is_published;
      if (filter.is_blocked !== undefined) where.is_blocked = filter.is_blocked;
    }

    if (filter.category_id !== undefined) where.category_id = filter.category_id;
    if (filter.author_id !== undefined) where.author_id = filter.author_id;
    if (filter.series_id !== undefined) where.series_id = filter.series_id;
    if (filter.is_pinned !== undefined) where.is_pinned = filter.is_pinned;
    
    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { content: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.post.count({ where }),
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [filter.sortBy || 'created_at']: filter.sortOrder || 'desc' },
        include: {
          Category: true,
          Author: { select: { id: true, fullname: true, avatar: true } },
          BlockedBy: { select: { id: true, fullname: true, avatar: true } },
          Series: true,
          Tag: true,
          _count: { select: { Comment: true, PostLike: true } },
        },
      }),
    ]);

    return {
      items: items.map(item => PostMapper.toDomain(item) as PostEntity),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<PostEntity | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        Category: true,
        Author: { select: { id: true, fullname: true, avatar: true } },
        BlockedBy: { select: { id: true, fullname: true, avatar: true } },
        Series: true,
        Tag: true,
        _count: { select: { Comment: true, PostLike: true } },
      },
    });
    return PostMapper.toDomain(post);
  }

  async findBySlug(slug: string): Promise<PostEntity | null> {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        Category: true,
        Author: { select: { id: true, fullname: true, avatar: true } },
        BlockedBy: { select: { id: true, fullname: true, avatar: true } },
        Series: true,
        Tag: true,
        _count: { select: { Comment: true, PostLike: true } },
      },
    });
    return PostMapper.toDomain(post);
  }

  async create(authorId: number, data: CreatePostDto): Promise<PostEntity> {
    const { tags, series_name, series_id, category_id, ...postData } = data;
    
    let seriesData: any = undefined;
    if (series_name && series_name.trim()) {
      const slug = slugify(series_name.trim(), { lower: true, strict: true, locale: 'vi' });
      seriesData = {
        connectOrCreate: {
          where: { slug },
          create: { name: series_name.trim(), slug }
        }
      };
    } else if (series_id) {
      seriesData = { connect: { id: series_id } };
    }

    const post = await this.prisma.post.create({
      data: {
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        cover_image: postData.cover_image,
        is_published: postData.is_published,
        is_pinned: postData.is_pinned,
        Author: { connect: { id: authorId } },
        Category: category_id ? { connect: { id: category_id } } : undefined,
        Tag: tags ? {
          connectOrCreate: tags.split(',').map(tag => ({
            where: { name: tag.trim() },
            create: { name: tag.trim() }
          }))
        } : undefined,
        Series: seriesData
      } as any,
      include: {
        Category: true,
        Author: { select: { id: true, fullname: true, avatar: true } },
        Tag: true,
        Series: true,
        _count: { select: { Comment: true, PostLike: true } },
      }
    });
    return PostMapper.toDomain(post) as PostEntity;
  }

  async update(id: number, data: UpdatePostDto): Promise<PostEntity> {
    const { tags, series_name, series_id, category_id, ...postData } = data;
    
    let seriesData: any = undefined;
    if (series_name !== undefined) {
      if (series_name && series_name.trim()) {
        const slug = slugify(series_name.trim(), { lower: true, strict: true, locale: 'vi' });
        seriesData = {
          connectOrCreate: {
            where: { slug },
            create: { name: series_name.trim(), slug }
          }
        };
      } else {
        seriesData = { disconnect: true };
      }
    } else if (series_id) {
      seriesData = { connect: { id: series_id } };
    }

    const post = await this.prisma.post.update({
      where: { id },
      data: {
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        cover_image: postData.cover_image,
        is_published: postData.is_published,
        is_pinned: postData.is_pinned,
        is_blocked: postData.is_blocked,
        BlockedBy: (postData as any).blocked_by_id 
          ? { connect: { id: (postData as any).blocked_by_id } } 
          : ((postData as any).blocked_by_id === null ? { disconnect: true } : undefined),
        Category: category_id ? { connect: { id: category_id } } : undefined,
        Tag: tags !== undefined ? {
          set: [],
          connectOrCreate: (tags || '').split(',').filter(t => t.trim()).map(tag => ({
            where: { name: tag.trim() },
            create: { name: tag.trim() }
          }))
        } : undefined,
        Series: seriesData
      } as any,
      include: {
        Category: true,
        Author: { select: { id: true, fullname: true, avatar: true } },
        Tag: true,
        Series: true,
        _count: { select: { Comment: true, PostLike: true } },
      }
    });
    return PostMapper.toDomain(post) as PostEntity;
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.post.delete({ where: { id } });
    } catch (error) {
      if ((error as any).code === 'P2025') {
        throw new PostNotFoundException(id);
      }
      throw error;
    }
  }

  async incrementView(id: number): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  async togglePin(id: number): Promise<PostEntity> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new PostNotFoundException(id);
    const updated = await this.prisma.post.update({
      where: { id },
      data: { is_pinned: !post.is_pinned },
      include: {
        Category: true,
        Author: { select: { id: true, fullname: true, avatar: true } },
        _count: { select: { Comment: true, PostLike: true } },
      }
    });
    return PostMapper.toDomain(updated) as PostEntity;
  }

  async togglePublish(id: number, reason?: string): Promise<PostEntity> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new PostNotFoundException(id);
    const updated = await this.prisma.post.update({
      where: { id },
      data: { is_published: !post.is_published },
      include: {
        Category: true,
        Author: { select: { id: true, fullname: true, avatar: true } },
        _count: { select: { Comment: true, PostLike: true } },
      }
    });
    return PostMapper.toDomain(updated) as PostEntity;
  }

  async toggleLike(postId: number, userId: number): Promise<{ liked: boolean }> {
    const existing = await this.prisma.postLike.findUnique({
      where: { user_id_post_id: { user_id: userId, post_id: postId } }
    });

    if (existing) {
      await this.prisma.postLike.delete({ where: { id: existing.id } });
      return { liked: false };
    } else {
      await this.prisma.postLike.create({
        data: { post_id: postId, user_id: userId }
      });
      return { liked: true };
    }
  }

  async checkLikeStatus(postId: number, userId: number): Promise<{ liked: boolean }> {
    const existing = await this.prisma.postLike.findUnique({
      where: { user_id_post_id: { user_id: userId, post_id: postId } }
    });
    return { liked: !!existing };
  }

  async findNeighborsInSeries(seriesId: number, currentOrder: number): Promise<{ prev: PostEntity | null; next: PostEntity | null }> {
    const [prev, next] = await Promise.all([
      this.prisma.post.findFirst({
        where: {
          series_id: seriesId,
          series_order: { lt: currentOrder },
          is_published: true,
        },
        orderBy: { series_order: 'desc' },
        include: { _count: { select: { Comment: true, PostLike: true } } },
      }),
      this.prisma.post.findFirst({
        where: {
          series_id: seriesId,
          series_order: { gt: currentOrder },
          is_published: true,
        },
        orderBy: { series_order: 'asc' },
        include: { _count: { select: { Comment: true, PostLike: true } } },
      }),
    ]);

    return {
      prev: PostMapper.toDomain(prev),
      next: PostMapper.toDomain(next),
    };
  }
}
