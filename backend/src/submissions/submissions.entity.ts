import { List } from 'src/list/lists.entity';
import { ListQuestion } from 'src/listQuestion/listQuestion.entity';
import { Question } from 'src/questions/questions.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class Submission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    listQuestionId: number;

    @Column()
    listId: number;

    @Column()
    subId: number;

    @Column()
    questionId: number;

    @Column()
    status: string;

    @Column()
    language: string;

    @Column()
    time: string;

    @Column({ type: 'text' })
    code: string;

    @Column()
    memory: string;

    @Column()
    userId: number;

    @ManyToOne(() => ListQuestion, (entity) => entity.submissions)
    listQuestion: ListQuestion;

    @ManyToOne(() => List, (entity) => entity.submissions)
    list: List;

    @ManyToOne(() => Question, (entity) => entity.submissions)
    question: Question;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: string;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: string;
}
