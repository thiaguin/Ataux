import { QuestionTag } from 'src/questionTags/questionTags.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: string;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: string;

    @OneToMany(() => QuestionTag, (questionTags) => questionTags.tag)
    questions: QuestionTag[];
}
