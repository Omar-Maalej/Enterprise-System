import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => String, { description: 'Content of the comment' })
  content: string;

  @Field(() => Int, { description: 'Unique identifier for the author (user)' })
  authorId: number;

  @Field(() => Int, { description: 'Unique identifier for the post' })
  postId: number;
}
