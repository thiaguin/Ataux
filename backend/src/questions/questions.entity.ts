import { Class } from 'src/classes/classes.entity';
import { QuestionLevel } from 'src/enums/questionLevel.enum';
import { List } from 'src/list/lists.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text' })
    url: string;

    @Column()
    level: QuestionLevel;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: string;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: string;
}
