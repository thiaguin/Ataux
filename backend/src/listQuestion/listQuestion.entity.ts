import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Question } from 'src/questions/questions.entity';
import { Tag } from 'src/tags/tags.entity';
import { List } from 'src/list/lists.entity';

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
}
