import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { IPostRepository, I_POST_REPOSITORY } from '../domain/post.repository.interface';
import { PostEntity } from '../domain/post.entity';
import { User, UserRole } from '@portfolio/types';
import { CreatePostDto } from '@portfolio/contracts';
import sanitizeHtml from 'sanitize-html';
import slugify from 'slugify';
import { MediaManagerService } from '../../upload/media-manager.service';

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject(I_POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
    private readonly mediaManager: MediaManagerService,
  ) {}

  private sanitizeOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'p', 'br',
      'strong', 'em', 'u', 's', 'blockquote', 'pre', 'ol', 'ul', 'li', 'a',
    ]),
    allowedAttributes: {
      '*': ['style', 'class', 'id', 'align'],
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'style'],
    },
    allowedStyles: {
      '*': {
        color: [/.*/],
        'background-color': [/.*/],
        'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
        'font-family': [/.*/],
        'font-size': [/.*/],
        'font-weight': [/.*/],
        'text-decoration': [/.*/],
        margin: [/.*/],
        padding: [/.*/],
        'padding-left': [/.*/],
        'list-style-type': [/.*/],
      },
    },
  };

  async execute(user: User, data: CreatePostDto): Promise<PostEntity> {
    if (!user.can_post) throw new ForbiddenException('Tài khoản bị cấm đăng bài.');

    const cleanContent = sanitizeHtml(data.content || '', this.sanitizeOptions);
    const baseSlug = data.slug || slugify(data.title, { lower: true, strict: true, locale: 'vi' });
    
    let finalSlug = baseSlug;
    let count = 0;
    while (true) {
      const existing = await this.postRepository.findBySlug(finalSlug);
      if (!existing) break;
      count++;
      finalSlug = `${baseSlug}-${count}`;
    }

    const post = await this.postRepository.create(user.id, {
      ...data,
      content: cleanContent,
      slug: finalSlug,
      is_pinned: (user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN) && data.is_pinned ? true : false,
    });

    // Register media usages
    if (post.cover_image) {
      await this.mediaManager.registerUsage(post.cover_image, 'POST', post.id, 'cover');
    }
    if (post.content) {
      await this.mediaManager.syncContentUsages('POST', post.id, post.content);
    }

    return post;
  }
}
