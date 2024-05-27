import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { Post } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { AuthModule } from 'src/auth/auth.module'; // Import AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Comment]),
    AuthModule, // Add AuthModule here
  ],
  providers: [PostsService, PostsResolver],
  exports: [PostsService, TypeOrmModule],
})
export class PostsModule {}
