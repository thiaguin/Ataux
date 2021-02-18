import { UserClass } from 'src/usersClasses/usersClasses.entity';
import { List } from 'src/list/lists.entity';

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class Class {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    code: string;

    @OneToMany(() => List, (list) => list.class) // note: we will create author property in the Photo class below
    lists: List[];

    @OneToMany(() => UserClass, (userClass) => userClass.class)
    users: UserClass[];

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: string;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: string;
}
