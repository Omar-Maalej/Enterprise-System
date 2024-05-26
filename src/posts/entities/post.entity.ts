import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { OneToMany } from 'typeorm';
import { Comment } from 'src/comments/entities/comment.entity';

@ObjectType()
export class Post {
  @Field(() => Int, { description: 'Unique identifier for the post' })
  id: number;

  @Field(() => String, { description: 'Content of the post' })  
  content: string;

  @Field(() => User, { description: 'Author of the post' })
  author: User;

  @Field(() => [Comment], { description: 'Comments on the post' })
  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];

}
