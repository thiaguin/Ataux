import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Question } from 'src/questions/questions.entity';
import { UserList } from 'src/userList/userList.entity';
import { List } from 'src/list/lists.entity';

@Entity()
export class UserQuestionList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userListId: number;

    @Column()
    listId: number;

    @Column()
    userId: number;

    @Column()
    questionId: number;

    @Column()
    count: number;

    @Column()
    status: string;

    @Column({ type: 'int', default: 0 })
    penalty: number;

    @ManyToOne(() => List, (list) => list.usersQuestions, { onDelete: 'CASCADE' })
    list: List;

    @ManyToOne(() => Question, (question) => question.lists, { onDelete: 'CASCADE' })
    question: Question;

    @ManyToOne(() => UserList, (userList) => userList.questions, { onDelete: 'CASCADE' })
    userList: UserList;
}
