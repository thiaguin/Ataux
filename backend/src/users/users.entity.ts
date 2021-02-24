import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    OneToMany,
    OneToOne,
    BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserClass } from 'src/usersClasses/usersClasses.entity';
import { SubmissionAssociationDTO } from 'src/submissions/submission-associations.dto';
import { Submission } from 'src/submissions/submissions.entity';
import { UserList } from 'src/userList/userList.entity';
import { UserResetPassword } from 'src/userResetPassword/userResetPassword.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    handle: string;

    @Column({ nullable: true, select: false })
    password: string;

    @Column()
    method: string;

    @Column({ nullable: true })
    googleId: string;

    @Column({ nullable: true })
    registration: string;

    @OneToMany(() => UserClass, (userClass) => userClass.user)
    classes: UserClass[];

    @OneToMany(() => UserList, (userList) => userList.user)
    lists: UserList[];

    @OneToOne(() => UserResetPassword, (userResetPassword) => userResetPassword.user) // specify inverse side as a second parameter
    resetPassword: UserResetPassword;

    @OneToMany(() => Submission, (submission) => submission.user)
    submissions: Submission[];

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: string;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: string;

    @BeforeUpdate()
    @BeforeInsert()
    cryptPassword() {
        if (this.password) {
            const salt = bcrypt.genSaltSync(+process.env.SIZE);
            this.password = bcrypt.hashSync(this.password, salt);
        }
    }
}
