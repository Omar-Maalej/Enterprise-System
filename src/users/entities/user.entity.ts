import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { UserRoleEnum } from 'src/enums/user-role.enum';
import { Room } from 'src/room/entities/room.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Entity('user')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({
    length: 50,
    unique: true,
  })
  @Field()
  username: string;

  @Column({
    unique: true,
  })
  @Field()
  email: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  @Field()
  role: string;

  @Column()
  @Field({
    nullable: true,
  })
  hireDate: Date;

  @Column()
  @Field({
    nullable: true,
  })
  phoneNumber: string;

  @Column()
  @Field({
    nullable: true,
  })
  department: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  @Exclude()
  salt: string;

  @DeleteDateColumn({ nullable: true, default: null })
  @Field({ nullable: true })
  deletedAt: Date; // Soft delete column

  @ManyToMany(() => Room, (room) => room.users)
  @JoinTable()
  rooms: Room[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}
