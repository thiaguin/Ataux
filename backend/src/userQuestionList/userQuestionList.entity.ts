import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Question } from 'src/questions/questions.entity';
import { UserList } from 'src/userList/userList.entity';

@Entity()
export class UserQuestionList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userListId: number;

    @Column()
    questionId: number;

    @Column()
    count: number;

    @Column()
    status: string;

    @ManyToOne(() => Question, (question) => question.lists)
    question: Question;

    @ManyToOne(() => UserList, (userList) => userList.questions)
    userList: UserList;
}
