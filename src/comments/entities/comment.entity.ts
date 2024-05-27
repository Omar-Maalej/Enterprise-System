import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Entity()
export class Comment {
  @Field(() => Int, { description: 'Unique identifier for the comment' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { description: 'Content of the comment' })
  @Column()
  content: string;

  @Field(() => User, { description: 'Author of the comment' })
  @ManyToOne(() => User, (user) => user.comments, { eager: true })
  author: User;

  @Field(() => Post, { description: 'Post the comment belongs to' })
  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  post: Post;

  @Field(() => Date, { description: 'Created date of the post' })
  @CreateDateColumn({ nullable: true })
  createdAt: Date;
}
