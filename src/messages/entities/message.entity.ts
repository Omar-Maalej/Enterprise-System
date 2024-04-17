import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderId: number;

  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column({ name: 'receiverId' })
  receiverId: number;

  @Column('text')
  messageContent: string;

  @Column({ default: false }) // false : is not a room, true: is a room
  isRoom: boolean;

  @CreateDateColumn()
  createdAt: Date;

}