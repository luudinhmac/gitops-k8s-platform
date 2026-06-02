import { Injectable, BadRequestException } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../../../prisma/prisma.service';
import { IPostRepository } from '../domain/post.repository.interface';
import {
  PostFilter,
  PaginationParams,
  PaginatedResult,
} from '../domain/post.types';
import { PostEntity } from '../domain/post.entity';
import { PostMapper } from '../mappers/post.mapper';
import { CreatePostDto, UpdatePostDto } from '@portfolio/contracts';
import { PostNotFoundException } from '../domain/post.errors';

const defaultAuthorSelect = {
  id: true,
  username: true,
  Profile: {
    select: {
      fullname: true,
      avatar: true,
    },
  },
};

@Injectable()
export class PrismaPostRepository implements IPostRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(
    filter: PostFilter,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<PostEntity>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: any = {};

    const viewerId = filter.viewer_id;
    const isPublicSearch = !viewerId;

    if (isPublicSearch) {
      where.status = 'PUBLISHED';
    } else {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { author_id: viewerId },
            { status: 'PUBLISHED' },
            { status: 'BLOCKED' },
          ],
        },
      ];

      if (filter.is_published !== undefined) {
        where.status = filter.is_published ? 'PUBLISHED' : { not: 'PUBLISHED' };
      }
      if (filter.is_blocked !== undefined) {
        where.status = filter.is_blocked ? 'BLOCKED' : { not: 'BLOCKED' };
      }
    }

    if (filter.category_id !== undefined)
      where.category_id = filter.category_id;
    if (filter.author_id !== undefined) where.author_id = filter.author_id;
    if (filter.series_id !== undefined) where.series_id = filter.series_id;
    if (filter.is_pinned !== undefined) where.is_pinned = filter.is_pinned;

    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { content: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any =
      filter.sortBy === 'comments'
        ? { Comment: { _count: filter.sortOrder || 'desc' } }
        : { [filter.sortBy || 'created_at']: filter.sortOrder || 'desc' };

    const [total, items] = await Promise.all([
      this.prisma.post.count({ where }),
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          Category: true,
          Author: { select: defaultAuthorSelect },
          BlockedBy: { select: defaultAuthorSelect },
          Series: true,
          Tag: true,
          _count: { select: { Comment: true, PostLike: true } },
        },
      }),
    ]);

    return {
      items: items.map((item) => PostMapper.toDomain(item) as PostEntity),
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
        Author: { select: defaultAuthorSelect },
        BlockedBy: { select: defaultAuthorSelect },
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
        Author: { select: defaultAuthorSelect },
        BlockedBy: { select: defaultAuthorSelect },
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
      const slug = slugify(series_name.trim(), {
        lower: true,
        strict: true,
        locale: 'vi',
      });
      seriesData = {
        connectOrCreate: {
          where: {
            author_id_slug: {
              author_id: authorId,
              slug,
            },
          },
          create: {
            name: series_name.trim(),
            slug,
            Author: { connect: { id: authorId } },
          },
        },
      };
    } else if (series_id) {
      const series = await this.prisma.series.findUnique({
        where: { id: series_id },
      });
      if (
        series &&
        (series.author_id === null || series.author_id === authorId)
      ) {
        seriesData = { connect: { id: series_id } };
      } else {
        throw new BadRequestException(
          'Series không thuộc quyền sở hữu của bạn.',
        );
      }
    }

    let finalSeriesOrder: number | null = null;
    if (series_id || (series_name && series_name.trim())) {
      if (
        postData.series_order !== undefined &&
        postData.series_order !== null
      ) {
        finalSeriesOrder = Number(postData.series_order);
      } else {
        let targetSeriesId = series_id;
        if (!targetSeriesId && series_name && series_name.trim()) {
          const slug = slugify(series_name.trim(), {
            lower: true,
            strict: true,
            locale: 'vi',
          });
          const existingSeries = await this.prisma.series.findUnique({
            where: {
              author_id_slug: {
                author_id: authorId,
                slug,
              },
            },
          });
          if (existingSeries) {
            targetSeriesId = existingSeries.id;
          }
        }
        if (targetSeriesId) {
          const lastPost = await this.prisma.post.findFirst({
            where: { series_id: targetSeriesId },
            orderBy: { series_order: 'desc' },
            select: { series_order: true },
          });
          finalSeriesOrder =
            lastPost && lastPost.series_order !== null
              ? lastPost.series_order + 1
              : 1;
        } else {
          finalSeriesOrder = 1;
        }
      }
    }

    const post = await this.prisma.post.create({
      data: {
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        excerpt: (postData as any).excerpt,
        focus_keyword: (postData as any).focus_keyword,
        cover_image: postData.cover_image,
        status: postData.is_published ? 'PUBLISHED' : 'DRAFT',
        is_pinned: postData.is_pinned,
        series_order: finalSeriesOrder,
        Author: { connect: { id: authorId } },
        Category: category_id ? { connect: { id: category_id } } : undefined,
        Tag: tags
          ? {
              connectOrCreate: tags.split(',').map((tag) => ({
                where: { name: tag.trim() },
                create: { name: tag.trim() },
              })),
            }
          : undefined,
        Series: seriesData,
      } as any,
      include: {
        Category: true,
        Author: { select: defaultAuthorSelect },
        Tag: true,
        Series: true,
        _count: { select: { Comment: true, PostLike: true } },
      },
    });
    return PostMapper.toDomain(post) as PostEntity;
  }

  async update(id: number, data: UpdatePostDto): Promise<PostEntity> {
    const { tags, series_name, series_id, category_id, ...postData } = data;

    const currentPost = await this.prisma.post.findUnique({ where: { id } });
    if (!currentPost) {
      throw new PostNotFoundException(id);
    }
    const authorId = currentPost.author_id;
    const isCurrentlyPublished = currentPost.status === 'PUBLISHED';
    const nextPublished =
      postData.is_published !== undefined
        ? postData.is_published
        : isCurrentlyPublished;

    let seriesData: any = undefined;
    if (series_name !== undefined) {
      if (series_name && series_name.trim()) {
        const slug = slugify(series_name.trim(), {
          lower: true,
          strict: true,
          locale: 'vi',
        });
        seriesData = {
          connectOrCreate: {
            where: {
              author_id_slug: {
                author_id: authorId!,
                slug,
              },
            },
            create: {
              name: series_name.trim(),
              slug,
              Author: { connect: { id: authorId! } },
            },
          },
        };
      } else {
        seriesData = { disconnect: true };
      }
    } else if (series_id) {
      const series = await this.prisma.series.findUnique({
        where: { id: series_id },
      });
      if (
        series &&
        (series.author_id === null || series.author_id === authorId)
      ) {
        seriesData = { connect: { id: series_id } };
      } else {
        throw new BadRequestException(
          'Series không thuộc quyền sở hữu của bạn.',
        );
      }
    }

    let finalSeriesOrder: number | null | undefined = undefined;
    if (postData.series_order !== undefined) {
      finalSeriesOrder =
        postData.series_order !== null ? Number(postData.series_order) : null;
    } else if (series_id !== undefined || series_name !== undefined) {
      if (series_id === null || series_name === '') {
        finalSeriesOrder = null;
      } else {
        let targetSeriesId = series_id;
        if (!targetSeriesId && series_name && series_name.trim()) {
          const slug = slugify(series_name.trim(), {
            lower: true,
            strict: true,
            locale: 'vi',
          });
          const existingSeries = await this.prisma.series.findUnique({
            where: {
              author_id_slug: {
                author_id: authorId!,
                slug,
              },
            },
          });
          if (existingSeries) {
            targetSeriesId = existingSeries.id;
          }
        }
        if (targetSeriesId) {
          const lastPost = await this.prisma.post.findFirst({
            where: { series_id: targetSeriesId },
            orderBy: { series_order: 'desc' },
            select: { series_order: true },
          });
          finalSeriesOrder =
            lastPost && lastPost.series_order !== null
              ? lastPost.series_order + 1
              : 1;
        } else {
          finalSeriesOrder = 1;
        }
      }
    }

    const post = await this.prisma.post.update({
      where: { id },
      data: {
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        excerpt: (postData as any).excerpt,
        focus_keyword: (postData as any).focus_keyword,
        cover_image: postData.cover_image,
        status: postData.is_blocked
          ? 'BLOCKED'
          : nextPublished
            ? 'PUBLISHED'
            : 'DRAFT',
        published_at:
          nextPublished && !isCurrentlyPublished ? new Date() : undefined,
        is_pinned: postData.is_pinned,
        series_order:
          finalSeriesOrder !== undefined ? finalSeriesOrder : undefined,
        BlockedBy: (postData as any).blocked_by_id
          ? { connect: { id: (postData as any).blocked_by_id } }
          : (postData as any).blocked_by_id === null
            ? { disconnect: true }
            : undefined,
        blocked_reason: (postData as any).blocked_reason,
        Category: category_id ? { connect: { id: category_id } } : undefined,
        Tag:
          tags !== undefined
            ? {
                set: [],
                connectOrCreate: (tags || '')
                  .split(',')
                  .filter((t) => t.trim())
                  .map((tag) => ({
                    where: { name: tag.trim() },
                    create: { name: tag.trim() },
                  })),
              }
            : undefined,
        Series: seriesData,
      } as any,
      include: {
        Category: true,
        Author: { select: defaultAuthorSelect },
        Tag: true,
        Series: true,
        _count: { select: { Comment: true, PostLike: true } },
      },
    });
    return PostMapper.toDomain(post) as PostEntity;
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.post.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
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
        Author: { select: defaultAuthorSelect },
        _count: { select: { Comment: true, PostLike: true } },
      },
    });
    return PostMapper.toDomain(updated) as PostEntity;
  }

  async togglePublish(id: number, reason?: string): Promise<PostEntity> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new PostNotFoundException(id);
    const wasPublished = post.status === 'PUBLISHED';
    const updated = await this.prisma.post.update({
      where: { id },
      data: {
        status: wasPublished ? 'DRAFT' : 'PUBLISHED',
        published_at: wasPublished ? null : new Date(),
      },
      include: {
        Category: true,
        Author: { select: defaultAuthorSelect },
        _count: { select: { Comment: true, PostLike: true } },
      },
    });
    return PostMapper.toDomain(updated) as PostEntity;
  }

  async toggleLike(
    postId: number,
    userId: number,
  ): Promise<{ liked: boolean }> {
    const existing = await this.prisma.postLike.findUnique({
      where: { user_id_post_id: { user_id: userId, post_id: postId } },
    });

    if (existing) {
      await this.prisma.postLike.delete({ where: { id: existing.id } });
      return { liked: false };
    } else {
      await this.prisma.postLike.create({
        data: { post_id: postId, user_id: userId },
      });
      return { liked: true };
    }
  }

  async checkLikeStatus(
    postId: number,
    userId: number,
  ): Promise<{ liked: boolean }> {
    const existing = await this.prisma.postLike.findUnique({
      where: { user_id_post_id: { user_id: userId, post_id: postId } },
    });
    return { liked: !!existing };
  }

  async findNeighborsInSeries(
    seriesId: number,
    currentOrder: number,
  ): Promise<{ prev: PostEntity | null; next: PostEntity | null }> {
    const [prev, next] = await Promise.all([
      this.prisma.post.findFirst({
        where: {
          series_id: seriesId,
          series_order: { lt: currentOrder },
          status: 'PUBLISHED',
        },
        orderBy: { series_order: 'desc' },
        include: { _count: { select: { Comment: true, PostLike: true } } },
      }),
      this.prisma.post.findFirst({
        where: {
          series_id: seriesId,
          series_order: { gt: currentOrder },
          status: 'PUBLISHED',
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
