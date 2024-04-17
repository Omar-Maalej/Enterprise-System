import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRoomInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
