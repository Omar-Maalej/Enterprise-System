import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateRoomInput {
  @Field({ description: 'the name of the room' })
  name : string;

  @Field(() => [ID], { nullable: true, description: 'List of user IDs to be added to the room' })
  userIds?: number[];
}
