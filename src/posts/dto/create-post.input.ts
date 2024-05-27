import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field(() => String, { description: 'Content of the post' })
  content: string;

  @Field(() => Int, { description: 'Unique identifier for the author (user)' })
  authorId: number;

  @Field(() => String, { description: 'File', nullable: true })
  path: string;
}
