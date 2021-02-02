import { Class } from 'src/classes/classes.entity';
import { QuestionLevel } from 'src/enums/questionLevel.enum';
import { List } from 'src/list/lists.entity';
import { ListQuestion } from 'src/listQuestion/listQuestion.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { QuestionTag } from '../questionTags/questionTags.entity';
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

    @OneToMany(() => QuestionTag, (questionTags) => questionTags.question)
    tags: QuestionTag[];

    @OneToMany(() => ListQuestion, (listQuestions) => listQuestions.question)
    lists: ListQuestion[];
}
