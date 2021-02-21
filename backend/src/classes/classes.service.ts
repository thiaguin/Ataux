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
import { ListService } from 'src/list/lists.service';
import { QuestionStatus } from 'src/enums/questionStatus.enum';
import { UserResumeClass } from './dto/userResume-class.dto';

@Injectable()
export class ClassesService {
    @InjectRepository(Class)
    private repository: Repository<Class>;
    private listService: ListService;

    constructor() {
        this.repository = getCustomRepository(ClassRepository);
        this.listService = new ListService();
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

    async getResume(id: number): Promise<Class> {
        const entity = await this.findById(id);
        const listResumes = [];

        for (const list of entity.lists) {
            const [listResume] = await this.listService.getResume(list.id, {});

            const usersResume = [];

            for (const user of listResume.users) {
                const userResume: UserResumeClass = {};
                const questionsResume = {
                    [QuestionStatus.OK]: 0,
                    [QuestionStatus.NOK]: 0,
                    [QuestionStatus.BLANK]: listResume.questionsCount,
                };

                userResume.user = user.user;

                for (const question of user.questions) {
                    questionsResume[question.status] += 1;
                    questionsResume.BLANK -= 1;
                }

                userResume.questions = questionsResume;
                usersResume.push(userResume);
            }

            listResumes.push({ ...listResume, users: usersResume });
        }

        return { ...entity, lists: listResumes };
    }

    async findAndCountAll(): Promise<{ classes: Class[]; count: number }> {
        const [classes, count] = await this.repository.findAndCount();
        return { classes, count };
    }

    async findById(id: number): Promise<Class> {
        const entity = await this.repository.findOne({
            where: { id: id },
            relations: ['lists', 'users', 'users.user'],
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
