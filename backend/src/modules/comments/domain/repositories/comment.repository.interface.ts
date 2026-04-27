import { CommentEntity } from '../entities/comment.entity';
import { CreateCommentDto, UpdateCommentDto } from '@portfolio/types';

export const I_COMMENTS_REPOSITORY = 'I_COMMENTS_REPOSITORY';

export interface ICommentsRepository {
  findAll(params?: any): Promise<CommentEntity[]>;
  findById(id: number): Promise<CommentEntity | null>;
  create(data: CreateCommentDto): Promise<CommentEntity>;
  update(id: number, data: UpdateCommentDto): Promise<CommentEntity>;
  delete(id: number): Promise<void>;
  count(where?: any): Promise<number>;
}
