import { QuestionLevel } from 'src/enums/questionLevel.enum';
import { ListQuestion } from 'src/listQuestion/listQuestion.entity';
import { Submission } from 'src/submissions/submissions.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Unique } from 'typeorm';
import { QuestionTag } from '../questionTags/questionTags.entity';
@Entity()
@Unique('QUESTION_UQ_NAMES', ['title', 'contestId', 'problemId'])
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    contestId: string;

    @Column()
    problemId: string;

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

    @OneToMany(() => Submission, (submission) => submission.question)
    submissions: Submission[];
}
