import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PayloadUserDTO } from 'src/users/dto/payload-user.dto';
import { UserClass } from 'src/usersClasses/usersClasses.entity';
import { getCustomRepository, getManager, Repository } from 'typeorm';
import { Class } from './classes.entity';
import { ClassRepository } from './classes.repository';
import { CreateClassDTO } from './dto/create-class.dto';
import { UserRole } from '../enums/userRole.enum';
import { RegisterUserDTO } from './dto/register-user.dto';
import { UserClassRepository } from 'src/usersClasses/usersClasses.repository';

@Injectable()
export class ClassesService {
    @InjectRepository(Class)
    private repository: Repository<Class>;

    constructor() {
        this.repository = getCustomRepository(ClassRepository);
    }

    generateCode(): string {
        const result = [];
        const length = Math.floor(Math.random() * 10) + 6;
        const digits = '0123456789';
        const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const chars = digits + letters;

        for (let i = length; i > 0; --i) {
            result.push(chars[Math.floor(Math.random() * chars.length)]);
        }

        return result.join('');
    }

    async findAndCountAll(): Promise<{ classes: Class[]; count: number }> {
        const [classes, count] = await this.repository.findAndCount();
        return { classes, count };
    }

    async findById(id: number): Promise<Class> {
        const entity = await this.repository.findOne({
            where: { id: id },
            relations: ['lists'],
        });

        if (!entity) {
            throw new HttpException('NotFound', 404);
        }

        return entity;
    }

    async create(body: CreateClassDTO, user: PayloadUserDTO): Promise<Class> {
        return await getManager().transaction(async (transactionManager) => {
            const entity = transactionManager.create(Class, {
                ...body,
                code: this.generateCode(),
            });

            await transactionManager.save(entity);

            const userClass = transactionManager.create(UserClass, {
                userId: user.id,
                classId: entity.id,
                role: UserRole.ADMIN,
            });

            await transactionManager.save(userClass);

            return entity;
        });
    }

    async register(body: RegisterUserDTO, user: PayloadUserDTO): Promise<void> {
        const userClassRepository = getCustomRepository(UserClassRepository);
        const entity = await this.repository.findOne({
            where: { id: body.classId },
        });

        if (!entity) {
            throw new HttpException('NotFound', 404);
        }

        if (entity.code === body.code) {
            const userClass = userClassRepository.create({
                userId: user.id,
                classId: entity.id,
                role: UserRole.MEMBER,
            });

            await userClassRepository.save(userClass);
        }

        throw new HttpException('CodeInvalidToEntity', 400);
    }
}
