import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    OneToMany,
} from 'typeorm'
import * as bcrypt from 'bcryptjs'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    email: string

    @Column({ nullable: true })
    handle: string

    @Column({ nullable: true, select: false })
    password: string

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: string

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: string

    @BeforeInsert()
    cryptPassword() {
        const salt = bcrypt.genSaltSync(+process.env.SIZE)
        this.password = bcrypt.hashSync(this.password, salt)
    }
}