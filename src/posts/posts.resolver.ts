import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { UpdatePostInput } from './dto/update-post.input';
import { UserDec } from 'src/decorators/user.decorator';
import {  UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/users/entities/user.entity';
import { CreatePostInput } from './dto/create-post.input';
import { FileUpload } from 'src/fileuploads/FileUpload';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';


@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => Post)
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @UserDec() user: User,
    @UploadedFile() file?: FileUpload,
  ): Promise<Post> {
    console.log("user:", user);
    createPostInput.authorId = user.id;

    if (file) {
      const fileExtension = path.extname(file.filename);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(__dirname, '..', '..', 'uploads', fileName);

      // Ensure the uploads directory exists
      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      const writeStream = fs.createWriteStream(filePath);
      await new Promise((resolve, reject) => {
        file.createReadStream()
          .pipe(writeStream)
          .on('finish', resolve)
          .on('error', reject);
      });

      createPostInput.image.filename = `/uploads/${fileName}`;
    }

    return this.postsService.create(createPostInput);
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
