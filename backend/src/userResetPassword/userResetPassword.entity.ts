import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Question } from 'src/questions/questions.entity';
import { UserList } from 'src/userList/userList.entity';
import { User } from 'src/users/users.entity';

@Entity()
export class UserResetPassword {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    code: string;

    @Column()
    userId: number;

    @Column()
    expirationTime: string;

    @OneToOne(() => User, (user) => user.resetPassword)
    user: User;
}
