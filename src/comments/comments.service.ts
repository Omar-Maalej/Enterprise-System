import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { Comment } from './entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createCommentInput: CreateCommentInput): Promise<Comment> {
    const { content, authorId, postId } = createCommentInput;

    const author = await this.usersRepository.findOne({ where: { id: authorId } });
    if (!author) {
      throw new NotFoundException(`User with ID ${authorId} not found`);
    }

    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const newComment = this.commentsRepository.create({
      content,
      author,
      post,
    });

    return this.commentsRepository.save(newComment);
  }

  findAll(): Promise<Comment[]> {
    return this.commentsRepository.find({ relations: ['author', 'post'] });
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({ where: { id }, relations: ['author', 'post'] });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  async update(id: number, updateCommentInput: UpdateCommentInput): Promise<Comment> {
    const comment = await this.findOne(id);
    const { content, authorId, postId } = updateCommentInput;

    if (authorId) {
      const author = await this.usersRepository.findOne({ where: { id: authorId } });
      if (!author) {
        throw new NotFoundException(`User with ID ${authorId} not found`);
      }
      comment.author = author;
    }

    if (postId) {
      const post = await this.postsRepository.findOne({ where: { id: postId } });
      if (!post) {
        throw new NotFoundException(`Post with ID ${postId} not found`);
      }
      comment.post = post;
    }

    if (content) {
      comment.content = content;
    }

    return this.commentsRepository.save(comment);
  }

  async remove(id: number): Promise<Comment> {
    const comment = await this.findOne(id);
    return this.commentsRepository.remove(comment);
  }
}
