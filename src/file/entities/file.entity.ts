import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  path: string;

  @Column()
  type: string;
}
