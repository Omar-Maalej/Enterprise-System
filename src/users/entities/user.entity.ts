import { Exclude } from 'class-transformer';
import { UserRoleEnum } from 'src/enums/user-role.enum';
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    unique: true
  })
  username: string;

  @Column({
    length: 50,
  })
  firstname: string;


  @Column({
    length: 50
  })
  lastname: string;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  cin: string ;

   @Column({
        length: 50
  })
  jobtitle: string;

  @Column()
  picture: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER
})
  role: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  @Exclude()
    salt: string;

  @DeleteDateColumn({ nullable: true, default: null })
  deletedAt: Date; // Soft delete column

 
}