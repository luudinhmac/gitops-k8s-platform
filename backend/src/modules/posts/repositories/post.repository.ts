import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../../../prisma/prisma.service';
import { IPostsRepository } from './post.repository.interface';
import { PostEntity } from '../domain/post.entity';
import { CreatePostDto, UpdatePostDto } from '@portfolio/contracts';
import { PostFilter, PaginationParams, PaginatedResult } from '../domain/post.types';

@Injectable()
export class PostsRepository implements IPostsRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: PostFilter, pagination: PaginationParams): Promise<PaginatedResult<PostEntity>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    // Handle Visibility Logic:
    const viewerId = filter.viewer_id;
    const isPublicSearch = !viewerId; // No viewer means public view

    if (isPublicSearch) {
      // Public only sees published and NOT blocked
      where.is_published = true;
      where.is_blocked = false;
    } else {
      // Logic for logged-in users (including admins)
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            // 1. Author sees everything
            { author_id: viewerId },
            // 2. Published posts are visible to all (if not blocked)
            { AND: [{ is_published: true }, { is_blocked: false }] },
            // 3. Admins can see BLOCKED posts from anyone
            { is_blocked: true }
          ]
        }
      ];

      // Note: Admins see blocked posts via the OR condition above.
      // If a specific status was requested (like 'blocked'), we still apply that filter on top.
      if (filter.is_published !== undefined) where.is_published = filter.is_published;
      if (filter.is_blocked !== undefined) where.is_blocked = filter.is_blocked;
    }

    if (filter.category_id !== undefined) where.category_id = filter.category_id;
    if (filter.author_id !== undefined) where.author_id = filter.author_id;
    if (filter.series_id !== undefined) where.series_id = filter.series_id;
    if (filter.is_pinned !== undefined) where.is_pinned = filter.is_pinned;
    
    // Add logic from service if needed, or handle in repository
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
      items: items as any,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<PostEntity | null> {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        Category: true,
        Author: { select: { id: true, fullname: true, avatar: true } },
        BlockedBy: { select: { id: true, fullname: true, avatar: true } },
        Series: true,
        Tag: true,
        Comment: {
          where: { parent_id: null },
          include: {
            User: { select: { id: true, fullname: true, avatar: true } },
            Replies: {
              include: {
                User: { select: { id: true, fullname: true, avatar: true } },
                Replies: {
                  include: {
                    User: { select: { id: true, fullname: true, avatar: true } },
                  },
                  orderBy: { created_at: 'desc' },
                }
              },
              orderBy: { created_at: 'desc' },
            },
          },
          orderBy: { created_at: 'desc' },
        },
        _count: { select: { Comment: true, PostLike: true } },
      },
    }) as any;
  }

  async findBySlug(slug: string): Promise<PostEntity | null> {
    return this.prisma.post.findUnique({
      where: { slug },
      include: {
        Category: true,
        Author: { select: { id: true, fullname: true, avatar: true } },
        BlockedBy: { select: { id: true, fullname: true, avatar: true } },
        Series: true,
        Tag: true,
        Comment: {
          where: { parent_id: null },
          include: {
            User: { select: { id: true, fullname: true, avatar: true } },
            Replies: {
              include: {
                User: { select: { id: true, fullname: true, avatar: true } },
                Replies: {
                  include: {
                    User: { select: { id: true, fullname: true, avatar: true } },
                  },
                  orderBy: { created_at: 'desc' },
                }
              },
              orderBy: { created_at: 'desc' },
            },
          },
          orderBy: { created_at: 'desc' },
        },
        _count: { select: { Comment: true, PostLike: true } },
      },
    }) as any;
  }

  async findByAuthorId(authorId: number): Promise<PostEntity[]> {
    return this.prisma.post.findMany({
      where: { author_id: authorId },
      include: {
        Category: true,
        Author: { select: { id: true, fullname: true, avatar: true } },
        Tag: true,
        Series: true
      }
    }) as any;
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

    return this.prisma.post.create({
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
        Series: true
      }
    }) as any;
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

    return this.prisma.post.update({
      where: { id },
      data: {
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        cover_image: postData.cover_image,
        is_published: postData.is_published,
        is_pinned: postData.is_pinned,
        is_blocked: postData.is_blocked,
        BlockedBy: postData.blocked_by_id 
          ? { connect: { id: postData.blocked_by_id } } 
          : (postData.blocked_by_id === null ? { disconnect: true } : undefined),
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
        Series: true
      }
    }) as any;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.post.delete({ where: { id } });
  }

  async incrementView(id: number): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  async togglePin(id: number): Promise<PostEntity> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new Error('Post not found');
    return this.prisma.post.update({
      where: { id },
      data: { is_pinned: !post.is_pinned },
    }) as any;
  }

  async togglePublish(id: number, reason?: string): Promise<PostEntity> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new Error('Post not found');
    
    // Toggle logic: published -> draft, draft -> published. 
    // If blocked, we might handle it differently, but for now follows existing logic.
    return this.prisma.post.update({
      where: { id },
      data: { is_published: !post.is_published },
    }) as any;
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

  async count(filter: PostFilter): Promise<number> {
    const where: any = {};
    if (filter.author_id !== undefined) where.author_id = filter.author_id;
    return this.prisma.post.count({ where });
  }

  async findNeighborsInSeries(seriesId: number, currentOrder: number): Promise<{ prev: any | null; next: any | null }> {
    const [prev, next] = await Promise.all([
      this.prisma.post.findFirst({
        where: {
          series_id: seriesId,
          series_order: { lt: currentOrder },
          is_published: true,
        },
        orderBy: { series_order: 'desc' },
        include: { Category: true, Author: { select: { id: true, fullname: true, avatar: true } } },
      }),
      this.prisma.post.findFirst({
        where: {
          series_id: seriesId,
          series_order: { gt: currentOrder },
          is_published: true,
        },
        orderBy: { series_order: 'asc' },
        include: { Category: true, Author: { select: { id: true, fullname: true, avatar: true } } },
      }),
    ]);

    return { prev, next };
  }
}
