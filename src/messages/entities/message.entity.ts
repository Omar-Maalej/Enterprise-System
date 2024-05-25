import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Room } from '../../room/entities/room.entity';

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column({ name: 'receiverId', nullable: true })
  receiverId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @Column('text')
  messageContent: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: 'roomId', nullable: true })
  roomId: number;

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'roomId' })
  room: Room;
}