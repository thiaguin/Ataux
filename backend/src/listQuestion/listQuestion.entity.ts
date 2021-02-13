import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Question } from 'src/questions/questions.entity';
import { Tag } from 'src/tags/tags.entity';
import { List } from 'src/list/lists.entity';
import { Submission } from 'src/submissions/submissions.entity';

@Entity()
export class ListQuestion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    questionId: number;

    @Column()
    listId: number;

    @ManyToOne(() => Question, (question) => question.lists)
    question: Question;

    @ManyToOne(() => List, (list) => list.questions)
    list: Tag;

    @OneToMany(() => Submission, (submission) => submission.listQuestion)
    submissions: Submission[];
}
