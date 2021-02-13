import { Class } from 'src/classes/classes.entity';
import { ListQuestion } from 'src/listQuestion/listQuestion.entity';
import { Submission } from 'src/submissions/submissions.entity';
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

    @OneToMany(() => ListQuestion, (listQuestions) => listQuestions.list)
    questions: ListQuestion[];

    @OneToMany(() => Submission, (submission) => submission.list)
    submissions: Submission[];

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: string;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: string;
}
