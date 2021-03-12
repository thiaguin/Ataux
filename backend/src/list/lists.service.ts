import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListQuestion } from 'src/listQuestion/listQuestion.entity';
import {
    createQueryBuilder,
    EntityManager,
    getCustomRepository,
    getManager,
    getRepository,
    In,
    Repository,
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
import { QueryService } from 'src/utils/query.service';
import { EntityToQuery } from 'src/utils/dto/entityQuery.dto';
import { ListResumeDTO } from './dto/resume-list.dto';
import { Query } from 'typeorm/driver/Query';
import { QuestionStatus } from 'src/enums/questionStatus.enum';
import { CsvService } from 'src/utils/csv.service';
import { Response } from 'express';
import { BAD_REQUEST, NOT_FOUND } from 'src/resource/errorType.resource';
import { Submission } from 'src/submissions/submissions.entity';

@Injectable()
export class ListService {
    @InjectRepository(List)
    private repository: Repository<List>;
    private submissionService: SubmissionsService;
    private queryService: QueryService;
    private codeforcesService: CodeforcesService;
    private csvService: CsvService;

    constructor() {
        this.submissionService = new SubmissionsService();
        this.codeforcesService = new CodeforcesService();
        this.queryService = new QueryService();
        this.csvService = new CsvService();
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

    getUserQuestions(userQuestions, questions) {
        const result = [];

        for (const question of questions) {
            const [userQuestion] = userQuestions.filter((el) => el.questionId === question.questionId);
            result.push(userQuestion || { ...question });
        }

        return result;
    }

    questionHasOnList(submission, listQuestions) {
        for (const listQuestion of listQuestions) {
            const isSameContest = `${listQuestion.question.contestId}` === `${submission.problem.contestId}`;
            const isSameIndex = `${listQuestion.question.problemId}` === `${submission.problem.index}`;
            if (isSameContest && isSameIndex) return true;
        }

        return false;
    }

    async getUsersList(listId: number, query): Promise<UserList[]> {
        const { questions } = await this.findById(listId);

        const userQuestionDefault = questions.map((el) => ({
            question: el.question,
            questionId: el.question.id,
            count: 0,
            status: QuestionStatus.BLANK,
        }));

        const where = this.queryService.getQueryToFind(UserList, { ...query, listId });
        const userList = await this.getUserListRepository().find({
            where,
            relations: ['user', 'questions', 'questions.question'],
        });

        const users = userList.map((el) => {
            return {
                ...el,
                questions: this.getUserQuestions(el.questions, userQuestionDefault),
            };
        });

        return <any>users;
    }

    async create(body: CreateListDTO): Promise<List> {
        return await getManager().transaction(async (transactionManager) => {
            const { questions, ...listBody } = body;
            const newList = this.repository.create(listBody);
            await transactionManager.save(newList);
            await this.setListQuestions(transactionManager, newList, questions || []);
            return newList;
        });
    }

    async getToCSV(id: number, res: Response) {
        const listResume = await this.getResume(id, {});
        const columnsName = [
            'Name',
            'Handle',
            'Registration',
            ...listResume.questions.map((el, index) => {
                const [question] = <any>el.question;
                return `Question ${index + 1} - (${question.title})`;
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

            const rowValues = [
                currentUser.name,
                currentUser.handle,
                currentUser.registration || '',
                ...userQuestions,
                user.grade,
            ];

            const rowToInsert = {};

            for (const key in rowValues) {
                rowToInsert[columnsName[key]] = rowValues[key];
            }

            rows.push(rowToInsert);
        }

        const comparator = columnsName[0];
        const result = [columnsName, ...rows.sort((a, b) => (a[comparator] > b[comparator] ? 1 : -1))];

        return this.csvService.getCSV(result, listResume.title, res);
    }

    async getResume(id: number, query): Promise<List> {
        const queryBuild = createQueryBuilder(List, 'l');
        const entitiesRelation = this.getEntitiesRelation();
        const where = `l.id = '${id}' and ${this.queryService.getQueryToQueryBuilder(entitiesRelation, query)}`;
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

        throw new HttpException({ entity: 'List', type: NOT_FOUND }, 404);
    }

    async setQuestions(id: number, questionIds: number[]): Promise<void> {
        const list = await this.findById(id);

        return await getManager().transaction(async (transactionManager) => {
            await this.setListQuestions(transactionManager, list, questionIds);
        });
    }

    async setListQuestions(
        transaction: EntityManager,
        list: List,
        questionsToCreate: number[] = [],
        questionsToRemove: number[] = [],
    ): Promise<void> {
        const listQuestionRepository = getRepository(ListQuestion);

        if (questionsToRemove.length > 0) {
            await transaction.delete(UserQuestionList, { listId: list.id, questionId: In(questionsToRemove) });
            await transaction.delete(Submission, { listId: list.id, questionId: In(questionsToRemove) });
            await transaction.delete(ListQuestion, { listId: list.id, questionId: In(questionsToRemove) });
        }

        const listQuestions = questionsToCreate.map((questionId) =>
            listQuestionRepository.create({
                questionId,
                listId: list.id,
            }),
        );

        await transaction.save(listQuestions);
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
            throw new HttpException({ entity: 'List', type: NOT_FOUND }, 404);
        }

        return list;
    }

    async update(params: { id: number }, body: UpdateListDTO): Promise<void> {
        return await getManager().transaction(async (transactionManager) => {
            const { questions, ...bodyToEdit } = body;
            const list = await transactionManager.findOne(List, {
                where: { id: params.id },
                relations: ['questions', 'questions.question'],
            });

            if (!list) {
                throw new HttpException({ entity: 'List', type: NOT_FOUND }, 404);
            }

            const listQuestionsId = list.questions.map((el) => el.question.id);
            const questionsToCreate = questions.filter((el) => !listQuestionsId.includes(el));
            const questionsToRemove = listQuestionsId.filter((el) => !questions.includes(el));
            await transactionManager.update(List, { id: list.id }, { ...bodyToEdit });
            await this.setListQuestions(transactionManager, list, questionsToCreate, questionsToRemove);
        });
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

        throw new HttpException({ entity: 'UserClass', type: BAD_REQUEST }, 400);
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
                if (this.questionHasOnList(submission, listQuestions)) {
                    await this.submissionService.create(submission, data);
                }
            }
        }
    }
}
