import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserClass } from 'src/usersClasses/usersClasses.entity';
import { SubmissionAssociationDTO } from 'src/submissions/submission-associations.dto';
import { Submission } from 'src/submissions/submissions.entity';
import { UserList } from 'src/userList/userList.entity';

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

    @OneToMany(() => UserClass, (userClass) => userClass.user)
    classes: UserClass[];

    @OneToMany(() => UserList, (userList) => userList.user)
    lists: UserList[];

    @OneToMany(() => Submission, (submission) => submission.user)
    submissions: Submission[];

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: string;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: string;

    @BeforeInsert()
    cryptPassword() {
        if (this.password) {
            const salt = bcrypt.genSaltSync(+process.env.SIZE);
            this.password = bcrypt.hashSync(this.password, salt);
        }
    }
}
