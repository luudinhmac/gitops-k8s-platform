import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import sanitizeHtml from 'sanitize-html';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  private sanitizeOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'span']),
    allowedAttributes: {
      '*': ['style', 'class', 'id'],
      'a': ['href', 'name', 'target'],
      'img': ['src', 'alt', 'width', 'height']
    }
  };

  async findAll(user?: any, isAdmin: boolean = false) {
    const where: any = {};
    if (!isAdmin) {
      where.is_published = true;
    } else if (user && user.role !== 'admin') {
      where.author_id = user.id;
    }
    
    return this.prisma.post.findMany({
      where,
      orderBy: [
        { is_pinned: 'desc' },
        { created_at: 'desc' }
      ],
      include: {
        Category: true,
        User: {
          select: { fullname: true }
        },
        Tag: true,
        _count: {
          select: { Comment: true, PostLike: true }
        }
      }
    });
  }

  async findOne(id: number, incrementView: boolean = false) {
    if (incrementView) {
      console.log(`[PostsService] Incrementing views for post ID: ${id}`);
      try {
        await this.prisma.post.update({
          where: { id },
          data: { views: { increment: 1 } }
        });
      } catch (err) {
        console.error('Error incrementing view:', err);
      }
    }

    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        Category: true,
        User: {
          select: { fullname: true, avatar: true }
        },
        Tag: true,
        _count: {
          select: { Comment: true, PostLike: true }
        }
      }
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async create(user: any, data: any) {
    const { tags, category_id, ...postData } = data;
    const cleanContent = sanitizeHtml(data.content, this.sanitizeOptions);
    
    const createData: any = {
      ...postData,
      content: cleanContent,
      author_id: user.id,
      is_pinned: (user.role === 'admin' && data.is_pinned) ? true : false,
    };

    if (category_id && !isNaN(parseInt(category_id))) {
      createData.category_id = parseInt(category_id);
    } else if (category_id === null) {
      createData.category_id = null;
    }

    if (tags && typeof tags === 'string' && tags.trim()) {
      createData.Tag = {
        connectOrCreate: tags.split(',').map(tag => ({
          where: { name: tag.trim() },
          create: { name: tag.trim() }
        }))
      };
    }

    return this.prisma.post.create({
      data: createData
    });
  }

  async update(id: number, user: any, data: any) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    if (user.role !== 'admin' && post.author_id !== user.id) {
      throw new ForbiddenException('Bạn không có quyền sửa bài viết này.');
    }

    const { tags, ...postData } = data;
    const cleanContent = data.content ? sanitizeHtml(data.content, this.sanitizeOptions) : post.content;

    return this.prisma.post.update({
      where: { id },
      data: {
        ...postData,
        content: cleanContent,
        is_pinned: user.role === 'admin' ? data.is_pinned : post.is_pinned,
        Tag: {
          set: [], // Clear old tags
          connectOrCreate: tags?.split(',').map(tag => ({
            where: { name: tag.trim() },
            create: { name: tag.trim() }
          }))
        }
      }
    });
  }

  async remove(id: number, user: any) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    if (user.role !== 'admin' && post.author_id !== user.id) {
      throw new ForbiddenException('Bạn không có quyền xóa bài viết này.');
    }
    return this.prisma.post.delete({ where: { id } });
  }

  async togglePin(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    return this.prisma.post.update({
      where: { id },
      data: { is_pinned: !post.is_pinned }
    });
  }

  async toggleLike(id: number, userId: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    const existingLike = await this.prisma.postLike.findUnique({
      where: { user_id_post_id: { user_id: userId, post_id: id } }
    });

    if (existingLike) {
      await this.prisma.postLike.delete({ where: { id: existingLike.id } });
      await this.prisma.post.update({ where: { id }, data: { likes: { decrement: 1 } } });
      return { liked: false };
    } else {
      await this.prisma.postLike.create({
        data: { user_id: userId, post_id: id }
      });
      await this.prisma.post.update({ where: { id }, data: { likes: { increment: 1 } } });
      return { liked: true };
    }
  }

  async togglePublish(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    return this.prisma.post.update({
      where: { id },
      data: { is_published: !post.is_published }
    });
  }
}
