import { List } from 'src/list/lists.entity';
import { ListQuestion } from 'src/listQuestion/listQuestion.entity';
import { Question } from 'src/questions/questions.entity';
import { User } from 'src/users/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class Submission {
    @PrimaryGeneratedColumn()
    id: number;

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

    @Column({ type: 'text', select: false, nullable: true })
    code: string;

    @Column()
    memory: string;

    @Column()
    userId: number;

    @Column({ type: 'int', default: 0 })
    penalty: number;

    @Column({ nullable: true, type: 'timestamp with time zone' })
    createdTime: string;

    @ManyToOne(() => List, (entity) => entity.submissions, { onDelete: 'CASCADE' })
    list: List;

    @ManyToOne(() => Question, (entity) => entity.submissions, { onDelete: 'CASCADE' })
    question: Question;

    @ManyToOne(() => User, (entity) => entity.submissions, { onDelete: 'CASCADE' })
    user: User;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: string;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: string;
}
