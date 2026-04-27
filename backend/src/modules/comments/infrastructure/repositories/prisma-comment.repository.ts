import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ICommentsRepository } from '../../domain/repositories/comment.repository.interface';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { CommentMapper } from '../mappers/comment.mapper';
import { CreateCommentDto, UpdateCommentDto } from '@portfolio/types';

@Injectable()
export class PrismaCommentRepository implements ICommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(postId: number): Promise<CommentEntity[]> {
    const comments = await this.prisma.comment.findMany({
      where: { post_id: postId },
      include: {
        User: {
          select: {
            id: true,
            username: true,
            fullname: true,
            avatar: true,
          }
        }
      },
      orderBy: { created_at: 'asc' }
    });
    return comments.map(c => CommentMapper.toDomain(c) as CommentEntity);
  }

  async findById(id: number): Promise<CommentEntity | null> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        User: {
          select: {
            id: true,
            username: true,
            fullname: true,
            avatar: true,
          }
        }
      }
    });
    return CommentMapper.toDomain(comment);
  }

  async create(data: CreateCommentDto): Promise<CommentEntity> {
    const comment = await this.prisma.comment.create({
      data: data as any,
      include: {
        User: {
          select: {
            id: true,
            username: true,
            fullname: true,
            avatar: true,
          }
        }
      }
    });
    return CommentMapper.toDomain(comment) as CommentEntity;
  }

  async update(id: number, data: UpdateCommentDto): Promise<CommentEntity> {
    const comment = await this.prisma.comment.update({
      where: { id },
      data: data as any,
      include: {
        User: {
          select: {
            id: true,
            username: true,
            fullname: true,
            avatar: true,
          }
        }
      }
    });
    return CommentMapper.toDomain(comment) as CommentEntity;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.comment.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.prisma.comment.count({ where });
  }
}
