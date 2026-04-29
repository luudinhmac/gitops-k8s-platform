import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository, I_POST_REPOSITORY } from '../domain/post.repository.interface';
import { PostEntity } from '../domain/post.entity';
import { User } from '@portfolio/types';
import { UpdatePostDto } from '@portfolio/contracts';
import { MediaManagerService } from '../../upload/media-manager.service';
import { PostNotFoundException, UnauthorizedPostActionException } from '../domain/post.errors';
import sanitizeHtml from 'sanitize-html';
import slugify from 'slugify';

@Injectable()
export class UpdatePostUseCase {
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

  async execute(id: number, user: User, data: UpdatePostDto): Promise<PostEntity> {
    const post = await this.postRepository.findById(id);
    if (!post) throw new PostNotFoundException(id);

    if (!user.can_post) throw new UnauthorizedPostActionException('update (forbidden)');
    if (post.author_id !== user.id) {
      throw new UnauthorizedPostActionException('update (not owner)');
    }

    const cleanContent = data.content ? (sanitizeHtml(data.content, this.sanitizeOptions) || '') : (post.content || undefined);
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

    // Cover image usage registration
    if (data.cover_image && data.cover_image !== post.cover_image) {
      await this.mediaManager.registerUsage(data.cover_image, 'POST', id, 'cover');
      if (post.cover_image) {
        await this.mediaManager.unregisterUsage(post.cover_image, 'POST', id, 'cover');
      }
    }

    // Sync content images
    if (cleanContent !== undefined) {
      await this.mediaManager.syncContentUsages('POST', id, cleanContent);
    }

    return updated;
  }
}
