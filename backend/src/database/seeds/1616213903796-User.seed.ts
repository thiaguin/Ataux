import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRole } from 'src/enums/userRole.enum';
import { UserMethod } from 'src/enums/userMethod.enum';
import { User } from 'src/users/users.entity';

export class User1616213903796 implements MigrationInterface {
    public async up(_: QueryRunner): Promise<void> {
        const salt = bcrypt.genSaltSync(+process.env.SIZE);
        const users = [
            {
                name: 'José Thiago',
                email: 'thiaguin@email.com',
                password: bcrypt.hashSync('Thiago@2020', salt),
                method: UserMethod.LOCAL,
                confirmed: true,
                role: UserRole.ADMIN,
            },
            {
                name: 'Melina',
                email: 'melina@email.com',
                password: bcrypt.hashSync('Melina@2020', salt),
                method: UserMethod.LOCAL,
                confirmed: true,
                role: UserRole.ADMIN,
            },
        ];

        await getRepository(User).save(users);
    }

    public async down(_: QueryRunner): Promise<void> {
        //
    }
}
