import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Question } from 'src/questions/questions.entity';
import { Tag } from 'src/tags/tags.entity';
import { List } from 'src/list/lists.entity';
import { Submission } from 'src/submissions/submissions.entity';
import { User } from 'src/users/users.entity';
import { UserQuestionList } from 'src/userQuestionList/userQuestionList.entity';

@Entity()
export class UserList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    listId: number;

    @ManyToOne(() => List, (list) => list.users)
    list: List;

    @ManyToOne(() => User, (user) => user.lists)
    user: User;

    @OneToMany(() => UserQuestionList, (userQuestionList) => userQuestionList.userList)
    questions: UserQuestionList[];
}
