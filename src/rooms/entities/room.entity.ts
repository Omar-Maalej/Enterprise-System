import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Room {
  @Field(() => ID, { description: 'The unique identifier of the room' })
  id: number;

  @Field(() => String, { description: 'The name of the room' })
  name: string;

  @Field(() => Date, { description: 'The date and time the room was created' })
  createdAt: Date;

  @Field(() => [User], { description: 'List of users in the room' })
  users: User[];
}
