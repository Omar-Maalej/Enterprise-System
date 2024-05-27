import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { UserDec } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostEventEnum } from './enums/event.enum';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Mutation(() => Post)
  @UseGuards(JWTAuthGuard) // Apply the guard to this resolver method
  createPost(@Args('createPostInput') createPostInput: CreatePostInput, @UserDec() user: any){
    console.log("user:", user);
    createPostInput.authorId = user.id;
    const post = this.postsService.create(createPostInput);
    this.eventEmitter.emit(PostEventEnum.POST_CREATED, createPostInput);
    return post;
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
