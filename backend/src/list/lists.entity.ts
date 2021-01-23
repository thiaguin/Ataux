import { Class } from 'src/classes/classes.entity';
import { UserClass } from 'src/usersClasses/usersClasses.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
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

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: string;
}
