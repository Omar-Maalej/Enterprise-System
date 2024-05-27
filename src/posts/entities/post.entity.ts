import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { File } from 'src/file/entities/file.entity';

@ObjectType()
@Entity()
export class Post {
  @Field(() => Int, { description: 'Unique identifier for the post' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { description: 'Content of the post' })
  @Column()
  content: string;

  @Field(() => String, {
    description: 'Content of the post',

    nullable: true,
  })
  @Column({
    nullable: true,
  })
  path: string;

  @Field(() => Date, { description: 'Created date of the post' })
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => User, { description: 'Author of the post' })
  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  author: User;

  @Field(() => [Comment], {
    description: 'Comments on the post',
    nullable: true,
  })
  @OneToMany(() => Comment, (comment) => comment.post, {
    eager: true,
    cascade: true,
  })
  comments: Comment[];
}
