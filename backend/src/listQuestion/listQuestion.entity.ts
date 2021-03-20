import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Question } from 'src/questions/questions.entity';
import { List } from 'src/list/lists.entity';

@Entity()
export class ListQuestion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    questionId: number;

    @Column()
    listId: number;

    @Column({ default: 1 })
    weight: number;

    @ManyToOne(() => Question, (question) => question.lists, { onDelete: 'CASCADE' })
    question: Question;

    @ManyToOne(() => List, (list) => list.questions, { onDelete: 'CASCADE' })
    list: List;
}
