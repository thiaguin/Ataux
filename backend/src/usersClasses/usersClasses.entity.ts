import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Class } from 'src/classes/classes.entity';
import { User } from 'src/users/users.entity';
import { UserRole } from 'src/enums/userRole.enum';

@Entity()
export class UserClass {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    classId: number;

    @Column()
    userId: number;

    // @Column({ type: 'enum', enum: UserRole })
    // role: UserRole;

    @ManyToOne(() => Class, (entity) => entity.users, { onDelete: 'CASCADE' })
    class: Class;

    @ManyToOne(() => User, (entity) => entity.classes, { onDelete: 'CASCADE' })
    user: User;
}
