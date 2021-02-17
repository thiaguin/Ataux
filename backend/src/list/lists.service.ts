import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListQuestion } from 'src/listQuestion/listQuestion.entity';
import { QuestionsService } from 'src/questions/questions.service';
import { QuestionTag } from 'src/questionTags/questionTags.entity';
import {
    createQueryBuilder,
    getConnection,
    getCustomRepository,
    getManager,
    getRepository,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';
import { CreateListDTO } from './dto/create-list.dto';
import { FindAllListDTO } from './dto/findAll-list.dto';
import { QueryListDTO } from './dto/query-list.dto';
import { UpdateListDTO } from './dto/update-list.dto';
import { List } from './lists.entity';
import { ListRepository } from './lists.repository';
import { PayloadUserDTO } from '../users/dto/payload-user.dto';
import { CodeforcesService } from 'src/codeforces/codeforces.service';
import { SubmissionsService } from 'src/submissions/submissions.service';
import { CheckSubmissionListDTO } from './dto/checkSubmission-list.dto';
import { UserList } from 'src/userList/userList.entity';
import { UserClass } from 'src/usersClasses/usersClasses.entity';
import { UserQuestionList } from 'src/userQuestionList/userQuestionList.entity';
import { User } from 'src/users/users.entity';
import { Question } from 'src/questions/questions.entity';

@Injectable()
export class ListService {
    @InjectRepository(List)
    private repository: Repository<List>;
    private submissionService: SubmissionsService;
    private questionService: QuestionsService;
    private codeforcesService: CodeforcesService;

    constructor() {
        this.submissionService = new SubmissionsService();
        this.codeforcesService = new CodeforcesService();
        this.questionService = new QuestionsService();
        this.repository = getCustomRepository(ListRepository);
    }

    getUserListRepository(): Repository<UserList> {
        return getManager().getRepository(UserList);
    }

    getUserClassRepository(): Repository<UserClass> {
        return getManager().getRepository(UserClass);
    }

    getNickFromAttribute(attributeName: string): string {
        const listColumns = getConnection().getMetadata(List).ownColumns;
        const userListColumns = getConnection().getMetadata(UserList).ownColumns;
        const userQuestionListColumns = getConnection().getMetadata(UserQuestionList).ownColumns;
        const userColumns = getConnection().getMetadata(User).ownColumns;
        const questionColumns = getConnection().getMetadata(Question).ownColumns;

        const listColumnsName = listColumns.map((column) => column.propertyName);
        const userListColumnsName = userListColumns.map((column) => column.propertyName);
        const userQuestionListColumnsName = userQuestionListColumns.map((column) => column.propertyName);
        const userColumnsName = userColumns.map((column) => column.propertyName);
        const questionColumnsName = questionColumns.map((column) => column.propertyName);

        if (listColumnsName.includes(attributeName)) return 'l';
        else if (userListColumnsName.includes(attributeName)) return 'ul';
        else if (userQuestionListColumnsName.includes(attributeName)) return 'lq';
        else if (userColumnsName.includes(attributeName)) return 'u';
        else if (questionColumnsName.includes(attributeName)) return 'q';
        else return '';
    }

    getWhereToResume(id, attributes) {
        let result = `l.id = ${id}`;

        for (const key in attributes) {
            const nick = this.getNickFromAttribute(key);
            if (nick) result += ` and ${nick}.${key} = '${attributes[key]}'`;
        }

        return result;
    }

    async create(body: CreateListDTO): Promise<List> {
        const newList = this.repository.create(body);
        await this.repository.save(newList);
        return newList;
    }

    async getResume(id: number, query) {
        const queryBuild = createQueryBuilder(List, 'l');
        const where = this.getWhereToResume(id, query);
        const list = await queryBuild
            .leftJoinAndMapMany('l.users', 'l.users', 'ul')
            .leftJoinAndMapMany('ul.user', 'ul.user', 'u')
            .leftJoinAndMapMany('ul.questions', 'ul.questions', 'lq')
            .leftJoinAndMapMany('lq.question', 'lq.question', 'q')
            .where(where)
            .getMany();
        return list;
    }

    async addQuestions(id: number, questionIds: number[]): Promise<void> {
        const list = await this.findById(id);
        const listQuestionRepository = getRepository(ListQuestion);

        const listQuestions = questionIds.map((questionId) =>
            listQuestionRepository.create({
                questionId,
                listId: list.id,
            }),
        );

        await listQuestionRepository.save(listQuestions);
    }

    async findAll(query: QueryListDTO): Promise<FindAllListDTO> {
        const where = { ...query };
        const [lists, count] = await this.repository.findAndCount({ where });
        return { data: lists, count };
    }

    async findById(id: number): Promise<List> {
        const list = await this.repository.findOne({
            where: { id: id },
            relations: ['class', 'questions', 'questions.question'],
        });

        if (!list) {
            throw new HttpException('NotFound', 404);
        }

        return list;
    }

    async update(params: { id: number }, body: UpdateListDTO): Promise<void> {
        const list = await this.repository.findOne({
            where: { id: params.id },
        });

        if (!list) {
            throw new HttpException('NotFound', 404);
        }

        await this.repository.update({ id: params.id }, body);
    }

    async createUserListIfNotExist(list: List, user: PayloadUserDTO): Promise<UserList> {
        const userClass = await this.getUserClassRepository().findOne({
            where: { classId: list.classId, userId: user.id },
        });

        if (userClass) {
            const userList = await this.getUserListRepository().findOne({
                where: { listId: list.id, userId: user.id },
            });

            if (!userList) {
                const newUserList = this.getUserListRepository().create({
                    listId: list.id,
                    userId: user.id,
                });

                await this.getUserListRepository().save(newUserList);

                return newUserList;
            }

            return userList;
        }

        throw new HttpException('BadRequest', 400);
    }

    async checkSubmissions(id: number, user: PayloadUserDTO, body: CheckSubmissionListDTO) {
        const currUser = body.user || user;
        const list = await this.findById(id);
        const userList = await this.createUserListIfNotExist(list, user);

        const contests = {};
        const submissions = {};
        const listQuestions = list.questions.filter((value) => body.questions.includes(value.questionId));

        for (const value of listQuestions) {
            contests[value.question.contestId] = true;
        }

        for (const contest in contests) {
            submissions[contest] = await this.codeforcesService.getSubmissions(currUser.handle, contest);
        }

        for (const value of listQuestions) {
            const data = {
                userId: currUser.id,
                listQuestionId: value.id,
                listId: value.listId,
                questionId: value.questionId,
                limitTime: list.expirationTime,
                userListId: userList.id,
            };

            for (const submission of submissions[value.question.contestId]) {
                await this.submissionService.create(submission, data);
            }
        }
    }
}
