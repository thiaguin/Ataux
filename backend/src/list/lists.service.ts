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
import { QuestionStatus } from 'src/enums/questionStatus.enum';
import { CsvService } from 'src/utils/csv.service';
import { Response } from 'express';
import { BAD_REQUEST, NOT_FOUND } from 'src/resource/errorType.resource';
import { Submission } from 'src/submissions/submissions.entity';
import { UserRole } from 'src/enums/userRole.enum';
import { Query } from 'typeorm/driver/Query';

@Injectable()
export class ListService {
    statusToCSV = {
        [QuestionStatus.OK]: 'Aceito',
        [QuestionStatus.NOK]: 'Rejeitado',
        [QuestionStatus.BLANK]: '-',
    };

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
        const maxQuestionGrade = 10;
        const maxGrade = list.questions.length * 10;

        for (const value of list.users) {
            let usersGrade = 0;
            const questionsOK = {};

            for (const question of value.questions) {
                if (question.status === QuestionStatus.OK && !questionsOK[question.questionId]) {
                    questionsOK[question.questionId] = true;
                    usersGrade += Math.max(0, maxQuestionGrade - question.penalty);
                }
            }

            value.grade = maxGrade > 0 ? ((usersGrade * maxQuestionGrade) / maxGrade).toFixed(2) : '0';
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

    async getUsersList(listId: number, query: Query): Promise<UserList[]> {
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

        const users = userList
            .filter((el) => el.user.role === UserRole.MEMBER)
            .map((el) => {
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
        const listResumeUsers = listResume.users.filter((el) => el.user[0].role === UserRole.MEMBER);
        const columnsName = [
            'Nome',
            'Handle',
            'Matrícula',
            ...listResume.questions.map((el, index) => {
                const [question] = <any>el.question;
                return `Questão ${index + 1} - (${question.title})`;
            }),
            'Média',
        ];

        const rows = [];

        for (const user of listResumeUsers) {
            const questionsSubmmited = {};
            const [currentUser] = <any>user.user;

            for (const question of user.questions) {
                if (question.status === QuestionStatus.BLANK) {
                    questionsSubmmited[question.questionId] = `(${question.count})`;
                } else {
                    questionsSubmmited[question.questionId] = `${this.statusToCSV[question.status]} - (${
                        question.count
                    })`;
                }
            }

            const userQuestions = listResume.questions.map((question) => {
                return questionsSubmmited[question.questionId] || `(0)`;
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
            relations: ['class', 'questions', 'questions.question', 'usersQuestions'],
        });

        if (!list) {
            throw new HttpException({ entity: 'List', type: NOT_FOUND }, 404);
        }

        return list;
    }

    async findOne(id: number, user: any = {}): Promise<List> {
        const list = await this.repository.findOne({
            where: { id: id },
            relations: ['class', 'questions', 'questions.question', 'usersQuestions'],
        });

        if (!list) {
            throw new HttpException({ entity: 'List', type: NOT_FOUND }, 404);
        }

        if (user.role === UserRole.MEMBER && new Date(list.startTime) > new Date()) {
            throw new HttpException({ entity: 'List', type: NOT_FOUND }, 404);
        }

        if (user?.role === UserRole.MEMBER) {
            const userQuestions = {};

            for (const userQuestion of list.usersQuestions) {
                if (userQuestion.userId === user.id) {
                    userQuestions[userQuestion.questionId] = userQuestion.status;
                }
            }

            list.questions = list.questions.map((el) => ({
                ...el,
                status: userQuestions[el.question.id] || QuestionStatus.BLANK,
            }));
        } else {
            const questionUsers = {};

            for (const userQuestion of list.usersQuestions) {
                if (userQuestion.status === QuestionStatus.OK) {
                    questionUsers[userQuestion.questionId] = questionUsers[userQuestion.questionId] + 1 || 1;
                }
            }

            list.questions = list.questions.map((el) => ({
                ...el,
                status: questionUsers[el.question.id] || 0,
            }));
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

    async checkAllUsersSubmissions(id: number, questionsId: number[] = []) {
        const list = await this.findById(id);
        const listQuestionsId = list.questions.map((el) => el.questionId);
        const usersClass = await this.getUserClassRepository().find({
            where: { classId: list.classId },
            relations: ['user'],
        });

        const users = usersClass
            .filter((el) => el.user.handle && el.user.role === UserRole.MEMBER)
            .map((el) => el.user);

        const questions = questionsId.length > 0 ? questionsId : listQuestionsId;

        for (const user of users) {
            await this.checkSubmissions(list.id, <any>user, { questions });
        }
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
                startTime: list.startTime,
                userListId: userList.id,
            };

            for (const submission of submissions[value.question.contestId]) {
                if (this.questionHasOnList(submission, listQuestions)) {
                    await this.submissionService.create(submission, data);
                }
            }
        }
    }

    async remove(id: number): Promise<void> {
        const list = await this.repository.findOne({ where: { id } });

        if (!list) {
            throw new HttpException({ entity: 'List', type: NOT_FOUND }, 404);
        }

        this.repository.remove(list);
    }
}
