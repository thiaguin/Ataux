import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListQuestion } from 'src/listQuestion/listQuestion.entity';
import { createQueryBuilder, getCustomRepository, getManager, getRepository, Repository } from 'typeorm';
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
import { QueryService } from 'src/utils/query.service';
import { EntityToQuery } from 'src/utils/dto/entityQuery.dto';
import { ListResumeDTO } from './dto/resume-list.dto';
import { Query } from 'typeorm/driver/Query';
import { QuestionStatus } from 'src/enums/questionStatus.enum';

@Injectable()
export class ListService {
    @InjectRepository(List)
    private repository: Repository<List>;
    private submissionService: SubmissionsService;
    private queryService: QueryService;
    private codeforcesService: CodeforcesService;

    constructor() {
        this.submissionService = new SubmissionsService();
        this.codeforcesService = new CodeforcesService();
        this.queryService = new QueryService();
        this.repository = getCustomRepository(ListRepository);
    }

    getUserListRepository(): Repository<UserList> {
        return getManager().getRepository(UserList);
    }

    getUserClassRepository(): Repository<UserClass> {
        return getManager().getRepository(UserClass);
    }

    getEntitiesRelation(): EntityToQuery[] {
        return [
            { entity: List, nick: 'l' },
            { entity: ListQuestion, nick: 'lq' },
            { entity: Question, nick: 'lqq' },
            { entity: UserList, nick: 'ul' },
            { entity: UserQuestionList, nick: 'uql' },
            { entity: User, nick: 'u' },
            { entity: Question, nick: 'q' },
        ];
    }

    addUserGrade(list: List): List {
        const questionsWeight = {};
        let maxGrade = 0;

        for (const value of list?.questions) {
            maxGrade += value.weight;
            questionsWeight[value.questionId] = value.weight;
        }

        for (const value of list.users) {
            let userWeight = 0;

            for (const question of value.questions) {
                if (question.status === QuestionStatus.OK) {
                    userWeight += questionsWeight[question.questionId];
                }
            }

            value.grade = maxGrade > 0 ? ((userWeight * 100) / maxGrade).toFixed(2) : '0';
        }

        return list;
    }

    async create(body: CreateListDTO): Promise<List> {
        const newList = this.repository.create(body);
        await this.repository.save(newList);
        return newList;
    }

    async getToCSV(id: number) {
        const listResume = await this.getResume(id, {});
        const questionsWeight = {};
        let totalWeight = 0;

        for (const value of listResume.questions) {
            questionsWeight[value.questionId] = value.weight;
            totalWeight += value.weight;
        }

        const columnsName = [
            'Name',
            'Handle',
            ...listResume.questions.map((el, index) => {
                return `Question ${index + 1} - (${el.question.title})`;
            }),
            'Grade',
        ];

        const rows = [];

        for (const user of listResume.users) {
            const questionsSubmmited = {};
            const [currentUser] = <any>user.user;

            for (const question of user.questions) {
                questionsSubmmited[question.questionId] = `${question.status} - (${question.count})`;
            }

            const userQuestions = listResume.questions.map((question) => {
                return questionsSubmmited[question.questionId] || `${QuestionStatus.BLANK} - (0)`;
            });

            rows.push([currentUser.name, currentUser.handle, ...userQuestions, user.grade]);
        }

        const result = [columnsName, ...rows.sort((a, b) => (a[0] > b[0] ? 1 : -1))];
        return result;
    }

    async getResume(id: number, query): Promise<List> {
        const queryBuild = createQueryBuilder(List, 'l');
        const entitiesRelation = this.getEntitiesRelation();
        const where = `l.id = '${id}' and ${this.queryService.getQuery(entitiesRelation, query)}`;
        const [list] = await queryBuild
            .leftJoinAndMapMany('l.questions', 'l.questions', 'lq')
            .leftJoinAndMapMany('lq.question', 'lq.question', 'lqq')
            .leftJoinAndMapMany('l.users', 'l.users', 'ul')
            .leftJoinAndMapMany('ul.user', 'ul.user', 'u')
            .leftJoinAndMapMany('ul.questions', 'ul.questions', 'uql')
            .leftJoinAndMapMany('lq.question', 'lq.question', 'q')
            .where(where)
            .getMany();

        if (list) {
            return this.addUserGrade(list);
        }

        throw new HttpException('NotFound', 404);
    }

    async setQuestions(id: number, questionIds: number[]): Promise<void> {
        const list = await this.findById(id);
        const listQuestionRepository = getRepository(ListQuestion);

        return await getManager().transaction(async (transactionManager) => {
            await transactionManager.delete(ListQuestion, { listId: list.id });

            const listQuestions = questionIds.map((questionId) =>
                listQuestionRepository.create({
                    questionId,
                    listId: list.id,
                }),
            );

            await listQuestionRepository.save(listQuestions);
        });
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
