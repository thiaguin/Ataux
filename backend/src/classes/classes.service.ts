import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PayloadUserDTO } from 'src/users/dto/payload-user.dto';
import { UserClass } from 'src/usersClasses/usersClasses.entity';
import { createQueryBuilder, getCustomRepository, getManager, Repository } from 'typeorm';
import { Class } from './classes.entity';
import { ClassRepository } from './classes.repository';
import { CreateClassDTO } from './dto/create-class.dto';
import { UserRole } from '../enums/userRole.enum';
import { RegisterUserDTO } from './dto/register-user.dto';
import { UserClassRepository } from 'src/usersClasses/usersClasses.repository';
import { ListService } from 'src/list/lists.service';
import { QuestionStatus } from 'src/enums/questionStatus.enum';
import { UserResumeClass } from './dto/userResume-class.dto';
import { CsvService } from 'src/utils/csv.service';
import { Response } from 'express';
import { EntityToQuery } from 'src/utils/dto/entityQuery.dto';
import { List } from 'src/list/lists.entity';
import { User } from 'src/users/users.entity';
import { Query } from 'typeorm/driver/Query';
import { PaginateService } from 'src/utils/paginate.service';
import { QueryService } from 'src/utils/query.service';
import { QueryClassDTO } from './dto/query-class.dto';
import { BAD_REQUEST, NOT_FOUND, NOT_UNIQUE } from 'src/resource/errorType.resource';

@Injectable()
export class ClassesService {
    @InjectRepository(Class)
    private repository: Repository<Class>;
    private listService: ListService;
    private csvService: CsvService;
    private paginateService: PaginateService;
    private queryService: QueryService;
    constructor() {
        this.listService = new ListService();
        this.csvService = new CsvService();
        this.paginateService = new PaginateService();
        this.queryService = new QueryService();
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

    private getEntitiesRelation(): EntityToQuery[] {
        return [
            { entity: Class, nick: 'c' },
            { entity: List, nick: 'cl' },
            { entity: UserClass, nick: 'cu' },
            { entity: User, nick: 'cuu' },
        ];
    }

    async getResume(id: number): Promise<Class> {
        const entity = await this.findById(id);
        const classUsers = entity.users.filter((user) => user.user.role === UserRole.MEMBER);
        const listResumes = [];

        for (const list of entity.lists) {
            const listResume = await this.listService.getResume(list.id, {});
            const membersListResume = listResume.users.filter((userList) => {
                const [currUser] = <any>userList.user;
                return currUser.role === UserRole.MEMBER;
            });

            listResume.users = membersListResume;
            const usersResume = [];

            for (const user of listResume.users) {
                const userResume: UserResumeClass = {};
                const questionsResume = {
                    [QuestionStatus.OK]: 0,
                    [QuestionStatus.NOK]: 0,
                    [QuestionStatus.BLANK]: listResume.questions?.length || 0, //listResume.questionsCount,
                };

                userResume.user = user.user;

                for (const question of user.questions) {
                    questionsResume[question.status] += 1;
                    questionsResume.BLANK -= 1;
                }

                userResume.questions = { resume: questionsResume, grade: user.grade };
                usersResume.push(userResume);
            }

            listResumes.push({ ...listResume, users: usersResume });
        }

        return <any>{ ...entity, lists: listResumes, users: classUsers };
    }

    async getToCSV(id: number, res: Response) {
        const classResume = await this.getResume(id);
        const columnsName = [
            'Name',
            'Handle',
            ...classResume.lists.map((el, index) => `List ${index + 1} - ${el.title}`),
        ];
        const rows = [];
        const usersClass = {};
        const users = {};

        for (const user of classResume.users) {
            users[user.user.id] = { name: user.user.name, handle: user.user.handle };
            usersClass[user.user.id] = {};
        }

        for (const list of classResume.lists) {
            const visiteds = {};

            for (const userList of list.users) {
                const [currentUser] = <any>userList.user;
                const currentQuestions = <any>userList.questions;

                visiteds[currentUser.id] = true;
                usersClass[currentUser.id][list.id] = {
                    resume: currentQuestions.resume,
                    grade: currentQuestions.grade,
                };
            }

            for (const user of classResume.users) {
                if (!visiteds[user.userId]) {
                    usersClass[user.user.id][list.id] = { resume: { BLANK: list.questions?.length || 0 }, grade: '0' };
                }
            }
        }

        for (const key in usersClass) {
            const currentUser = users[key];
            const row = [currentUser.name, currentUser.handle];
            const rowToInsert = {};

            for (const list of classResume.lists) {
                row.push(usersClass[key][list.id].grade);
            }

            for (const index in columnsName) {
                rowToInsert[columnsName[index]] = row[index];
            }

            rows.push(rowToInsert);
        }

        const comparator = columnsName[0];
        const result = [columnsName, ...rows.sort((a, b) => (a[comparator] > b[comparator] ? 1 : -1))];
        return this.csvService.getCSV(result, classResume.name, res);
    }
    async findAndCountAll(query: QueryClassDTO): Promise<{ data: Class[]; count: number }> {
        const page = this.paginateService.getPage(query);
        const queryBuild = createQueryBuilder(Class, 'c');
        const entitiesRelation = this.getEntitiesRelation();
        const where = this.queryService.getQueryToQueryBuilder(entitiesRelation, <Query>query);

        const [classes, count] = await queryBuild
            .leftJoin('c.lists', 'cl')
            .leftJoin('c.users', 'cu')
            .leftJoin('cu.user', 'cuu')
            .where(where)
            .take(page.take)
            .skip(page.skip)
            .getManyAndCount();

        return { data: classes, count };
    }

    async findById(id: number): Promise<Class> {
        const entity = await this.repository.findOne({
            where: { id: id },
            relations: ['lists', 'users', 'users.user'],
        });

        if (!entity) {
            throw new HttpException({ entity: 'Class', type: NOT_FOUND }, 404);
        }

        return entity;
    }

    async findOne(id: number): Promise<Class> {
        const entity = await this.getResume(id);

        const { users, lists } = entity;

        const usersResult = [];
        const usersList = {};
        const userListDefault = [];

        for (const list of lists) {
            userListDefault.push({
                resume: { [QuestionStatus.BLANK]: list.questions.length },
                grade: 0,
            });
        }

        for (const user of users) {
            usersList[user.id] = userListDefault.map((a) => Object.assign({}, a));
        }

        for (const listKey in lists) {
            const list = lists[listKey];
            for (const userList of list.users) {
                const [user] = <any>userList.user;
                usersList[user.id][listKey] = userList.questions;
            }
        }

        for (const user of users) {
            usersResult.push({ ...user, lists: usersList[user.id] });
        }

        entity.users = <any>usersResult;

        return entity;
    }

    async create(body: CreateClassDTO, user: PayloadUserDTO): Promise<Class> {
        return await getManager().transaction(async (transactionManager) => {
            const entity = await transactionManager.findOne(Class, { where: { name: body.name } });

            if (entity) throw new HttpException({ entity: 'Class', type: NOT_UNIQUE }, 409);

            const newEntity = transactionManager.create(Class, {
                ...body,
                code: this.generateCode(),
            });

            await transactionManager.save(newEntity);

            const userClass = transactionManager.create(UserClass, {
                userId: user.id,
                classId: newEntity.id,
            });

            await transactionManager.save(userClass);

            return newEntity;
        });
    }

    async register(body: RegisterUserDTO, user: PayloadUserDTO): Promise<void> {
        const userClassRepository = getCustomRepository(UserClassRepository);
        const entity = await this.repository.findOne({
            where: { id: body.classId },
        });

        if (!entity) {
            throw new HttpException({ entity: 'Class', type: NOT_FOUND }, 404);
        }

        if (entity.code === body.code) {
            const userClass = userClassRepository.create({
                userId: user.id,
                classId: entity.id,
            });

            await userClassRepository.save(userClass);
        }

        throw new HttpException({ entity: 'InvalidCode', type: BAD_REQUEST }, 400);
    }
}
