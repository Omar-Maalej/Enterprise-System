import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Room {
  @Field(() => ID, { description: 'The unique identifier of the room' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { description: 'The name of the room' })
  @Column()
  name: string;

  @Field(() => Date, { description: 'The date and time the room was created' })
  @Column()
  createdAt: Date;

  @Field(() => [User], { description: 'List of users in the room' })
  @ManyToMany(()=>User, (user) => user.rooms)
  users: User[];
}
