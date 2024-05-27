import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { UpdatePostInput } from './dto/update-post.input';
import { UserDec } from 'src/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostEventEnum } from './enums/event.enum';
import { User } from 'src/users/entities/user.entity';
import { CreatePostInput } from './dto/create-post.input';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Mutation(() => Post)
  @UseGuards(JWTAuthGuard)
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @UserDec() user: User,
  ): Promise<Post> {
    console.log('user:', user);
    createPostInput.authorId = user.id;
    const post = this.postsService.create(createPostInput);
    this.eventEmitter.emit(PostEventEnum.POST_CREATED, createPostInput);
    return post;

    // return this.postsService.create(createPostInput);
  }

  @Query(() => [Post], { name: 'posts' })
  findAll() {
    return this.postsService.findAll();
  }

  @Query(() => Post, { name: 'post' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.postsService.findOne(id);
  }

  @Mutation(() => Post)
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postsService.update(updatePostInput.id, updatePostInput);
  }

  @Mutation(() => Post)
  removePost(@Args('id', { type: () => Int }) id: number) {
    return this.postsService.remove(id);
  }
}
