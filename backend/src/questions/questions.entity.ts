import { Class } from 'src/classes/classes.entity';
import { List } from 'src/list/lists.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  listId: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  url: string;

  @ManyToOne(() => List, (list) => list.questions)
  list: List;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: string;
}
