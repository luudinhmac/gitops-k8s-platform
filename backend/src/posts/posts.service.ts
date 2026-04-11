import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import sanitizeHtml from 'sanitize-html';
import slugify from 'slugify';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  private sanitizeOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'p', 'br', 'strong', 'em', 'u', 's', 
      'blockquote', 'pre', 'ol', 'ul', 'li', 'a'
    ]),
    allowedAttributes: {
      '*': ['style', 'class', 'id', 'align'],
      'a': ['href', 'name', 'target', 'rel'],
      'img': ['src', 'alt', 'width', 'height', 'style']
    },
    allowedStyles: {
      '*': {
        // Allow all common rich text styles
        'color': [/^#(?:[0-9a-fA-F]{3}){1,2}$/, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/, /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([\d\.]+)\s*\)$/],
        'background-color': [/.*/],
        'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
        'font-family': [/.*/],
        'font-size': [/.*/],
        'font-weight': [/.*/],
        'text-decoration': [/.*/],
        'margin': [/.*/],
        'padding': [/.*/],
        'padding-left': [/.*/],
        'list-style-type': [/.*/]
      }
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
          select: { fullname: true, username: true }
        },
        Tag: true,
        _count: {
          select: { Comment: true, PostLike: true }
        }
      }
    });
  }

  async findOne(idOrSlug: string | number, incrementView: boolean = false) {
    const isId = !isNaN(Number(idOrSlug));
    const where = isId ? { id: Number(idOrSlug) } : { slug: String(idOrSlug) };

    if (incrementView) {
      console.log(`[PostsService] Incrementing views for post: ${idOrSlug}`);
      try {
        await this.prisma.post.update({
          where,
          data: { views: { increment: 1 } }
        });
      } catch (err) {
        console.error('Error incrementing view:', err);
      }
    }

    const post = await this.prisma.post.findUnique({
      where,
      include: {
        Category: true,
        User: {
          select: { fullname: true, avatar: true, username: true }
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
    
    // Generate unique slug
    let slug = data.slug || slugify(data.title, { lower: true, strict: true, locale: 'vi' });
    let finalSlug = slug;
    let count = 0;
    while (true) {
      const existing = await this.prisma.post.findUnique({ where: { slug: finalSlug } });
      if (!existing) break;
      count++;
      finalSlug = `${slug}-${count}`;
    }

    const createData: any = {
      ...postData,
      slug: finalSlug,
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
    // KHÔNG cho phép Admin sửa bài của người khác (theo yêu cầu người dùng)
    if (post.author_id !== user.id) {
      throw new ForbiddenException('Bạn chỉ có thể chỉnh sửa bài viết của chính mình.');
    }

    const { tags, slug, ...postData } = data;
    const cleanContent = data.content ? sanitizeHtml(data.content, this.sanitizeOptions) : post.content;

    // Handle slug update if provided and different
    let finalSlug = post.slug;
    if (slug && slug !== post.slug) {
      finalSlug = slugify(slug, { lower: true, strict: true, locale: 'vi' });
      // Ensure unique
      let count = 0;
      let tempSlug = finalSlug;
      while (true) {
        const existing = await this.prisma.post.findFirst({ 
          where: { slug: tempSlug, NOT: { id } } 
        });
        if (!existing) break;
        count++;
        tempSlug = `${finalSlug}-${count}`;
      }
      finalSlug = tempSlug;
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        ...postData,
        slug: finalSlug,
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

  async togglePin(id: number, user: any) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    
    // Cho phép Admin hoặc Chủ bài viết
    if (user.role !== 'admin' && post.author_id !== user.id) {
      throw new ForbiddenException('Bạn không có quyền ghim bài viết này.');
    }

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

  async checkLikeStatus(id: number, userId: number) {
    const existingLike = await this.prisma.postLike.findUnique({
      where: { user_id_post_id: { user_id: userId, post_id: id } }
    });
    return { liked: !!existingLike };
  }

  async togglePublish(id: number, user: any) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    // Cho phép Admin hoặc Chủ bài viết
    if (user.role !== 'admin' && post.author_id !== user.id) {
      throw new ForbiddenException('Bạn không có quyền thay đổi trạng thái hiển thị của bài viết này.');
    }

    return this.prisma.post.update({
      where: { id },
      data: { is_published: !post.is_published }
    });
  }
}
