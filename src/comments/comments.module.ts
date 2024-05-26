import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { Comment } from './entities/comment.entity';
import { PostsModule } from 'src/posts/posts.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    PostsModule,
    UsersModule,
  ],
  providers: [CommentsResolver, CommentsService],
})
export class CommentsModule {}
