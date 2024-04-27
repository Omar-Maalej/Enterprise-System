import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { UserRoleEnum } from 'src/enums/user-role.enum';
import { Room } from 'src/rooms/entities/room.entity';
import { Column, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
@ObjectType()
export class User {

  @PrimaryGeneratedColumn()
  @Field(()=> ID)
  id: number;

  @Column({
    length: 50,
    unique: true
  })
  @Field()
  username: string;

  @Column({
    length: 50,
  })
  @Field()

  firstname: string;


  @Column({
    length: 50
  })
  @Field()
  lastname: string;

  @Column({
    unique: true
  })
  @Field()
  email: string;

  @Column()
  @Field()
  cin: string ;

   @Column({
        length: 50
  })
  @Field()
  jobtitle: string;

  @Column()
  @Field()
  picture: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER
})
@Field()
  role: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  @Exclude()
    salt: string;

  @DeleteDateColumn({ nullable: true, default: null })
  @Field({nullable:true})
  deletedAt: Date; // Soft delete column

  @ManyToMany(() => Room, (room)=>room.users, { eager: true })
  @JoinTable()
  rooms : Room[];
    
 
}