import { InputType, Int, Field } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'src/fileuploads/FileUpload';

@InputType()
export class CreatePostInput {
  @Field(() => String, { description: 'Content of the post' })
  content: string;

  @Field(() => Int, { description: 'Unique identifier for the author (user)' })
  authorId: number;

  @Field(() => GraphQLUpload)
 image: FileUpload;


}
