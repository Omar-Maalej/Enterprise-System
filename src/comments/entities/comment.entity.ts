import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Comment {
  @Field(() => Int, { description: 'Unique identifier for the comment' })
  id: number;

  @Field(() => String, { description: 'Content of the comment' })  
  content: string;

  @Field(() => Int, { description: 'Unique identifier for the post' })
  author: User;

  @Field(() => Int, { description: 'Unique identifier for the user' })
  post: Post;

}
