import { User } from '../../users/entities/user.entity';
import { Column, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;

  @Column()
  createdAt: Date;

  @ManyToMany(()=>User, (user) => user.rooms, {eager: true})
  users: User[];

  @DeleteDateColumn()
  deleteAt : Date;
}
