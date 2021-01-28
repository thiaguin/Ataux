import { Class } from 'src/classes/classes.entity';
import { Question } from 'src/questions/questions.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  classId: number;

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true, type: 'timestamp with time zone' })
  expirationTime: string;

  @ManyToOne(() => Class, (entity) => entity.lists)
  class: Class;

  @OneToMany(() => Question, (question) => question.list)
  questions: Question[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: string;
}
