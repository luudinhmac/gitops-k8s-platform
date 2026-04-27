import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IPostRepository, I_POST_REPOSITORY } from '../../domain/repositories/post.repository.interface';
import { PostEntity } from '../../domain/entities/post.entity';
import { User } from '@portfolio/types';
import { IStorageService, STORAGE_SERVICE } from '../../../../infrastructure/storage/storage.interface';
import sanitizeHtml from 'sanitize-html';
import slugify from 'slugify';

@Injectable()
export class UpdatePostUseCase {
  constructor(
    @Inject(I_POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
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

  async execute(id: number, user: User, data: any): Promise<PostEntity> {
    const post = await this.postRepository.findById(id);
    if (!post) throw new NotFoundException('Post not found');

    if (!user.can_post) throw new ForbiddenException('Tài khoản bị cấm sửa bài.');
    if (post.author_id !== user.id) {
      throw new ForbiddenException('Bạn chỉ có thể chỉnh sửa bài viết của chính mình.');
    }

    const cleanContent = data.content ? sanitizeHtml(data.content, this.sanitizeOptions) : post.content;
    let finalSlug = post.slug;
    if (data.slug && data.slug !== post.slug) {
      const base = slugify(data.slug, { lower: true, strict: true, locale: 'vi' });
      let temp = base;
      let count = 0;
      while (true) {
        const ex = await this.postRepository.findBySlug(temp);
        if (!ex || ex.id === id) break;
        count++;
        temp = `${base}-${count}`;
      }
      finalSlug = temp;
    }

    const updated = await this.postRepository.update(id, {
      ...data,
      content: cleanContent,
      slug: finalSlug,
    });

    if (data.cover_image && post.cover_image && post.cover_image !== data.cover_image) {
      await this.storageService.deleteFile(post.cover_image).catch(() => {});
    }

    return updated;
  }
}
