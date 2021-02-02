import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Question } from 'src/questions/questions.entity';
import { Tag } from 'src/tags/tags.entity';

@Entity()
export class QuestionTag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    questionId: number;

    @Column()
    tagId: number;

    @ManyToOne(() => Question, (question) => question.tags)
    question: Question;

    @ManyToOne(() => Tag, (tag) => tag.questions)
    tag: Tag;
}
