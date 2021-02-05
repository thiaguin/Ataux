import { Class } from 'src/classes/classes.entity';
import { ListQuestion } from 'src/listQuestion/listQuestion.entity';
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
export class Submission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    listQuestionId: number;

    @Column({ unique: true })
    status: string;

    @Column({ nullable: true, type: 'timestamp with time zone' })
    expirationTime: string;

    @ManyToOne(() => Class, (entity) => entity.lists)
    listQuestion: ListQuestion;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: string;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: string;
}
