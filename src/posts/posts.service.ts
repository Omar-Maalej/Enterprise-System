import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';



@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createPostInput: CreatePostInput): Promise<Post> {
    const { content, authorId } = createPostInput;

    const author = await this.usersRepository.findOne({ where: { id: authorId } });
    if (!author) {
      throw new NotFoundException(`User with ID ${authorId} not found`);
    }

    const newPost = this.postsRepository.create({
      image: createPostInput.image.filename,
      content,
      author,
    });

    await this.postsRepository.save(newPost);

    // Fetch the created post with its author and comments
    return this.postsRepository.findOne({
      where: { id: newPost.id },
      relations: ['author', 'comments'],
    });
  }

  findAll(): Promise<Post[]> {
    return this.postsRepository.find({ relations: ['author', 'comments'] });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id }, relations: ['author', 'comments'] });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async update(id: number, updatePostInput: UpdatePostInput): Promise<Post> {
    const post = await this.findOne(id);
    Object.assign(post, updatePostInput);
    return this.postsRepository.save(post);
  }

  async remove(id: number): Promise<Post> {
    const post = await this.findOne(id);
    return this.postsRepository.remove(post);
  }
}
