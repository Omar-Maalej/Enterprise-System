import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { Post } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Comment])],
  providers: [PostsService, PostsResolver],
  exports: [PostsService, TypeOrmModule], // Export TypeOrmModule to make repositories available
})
export class PostsModule {}
