import * as cheerio from 'cheerio';
import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { createQueryBuilder, getCustomRepository, getManager, Repository } from 'typeorm';
import { Submission } from './submissions.entity';
import { SubmissionRepository } from './submissions.repository';
import { CodeforcesSubmissionDTO } from 'src/codeforces/dto/codeforces-submission.dto';
import { SubmissionAssociationDTO } from './submission-associations.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserQuestionList } from 'src/userQuestionList/userQuestionList.entity';
import { SetUserQuestionListSubmission } from './dto/setUserQuestionList-submission.dto';
import { QuestionStatus } from 'src/enums/questionStatus.enum';
import { QueryService } from 'src/utils/query.service';
import { EntityToQuery } from 'src/utils/dto/entityQuery.dto';
import { User } from 'src/users/users.entity';
import { Question } from 'src/questions/questions.entity';
import { NOT_FOUND } from 'src/resource/errorType.resource';

@Injectable()
export class SubmissionsService {
    @InjectRepository(Submission)
    private repository: Repository<Submission>;
    private httpService: HttpService;
    private queryService: QueryService;
    private BASE_URL: string;

    constructor() {
        this.repository = getCustomRepository(SubmissionRepository);
        this.httpService = new HttpService();
        this.queryService = new QueryService();
        this.BASE_URL = 'http://codeforces.com';
    }

    getUserQuestionListRepository(): Repository<UserQuestionList> {
        return getManager().getRepository(UserQuestionList);
    }

    getEntitiesRelation(): EntityToQuery[] {
        return [
            { entity: Submission, nick: 's' },
            { entity: User, nick: 'su' },
            { entity: Question, nick: 'sq' },
        ];
    }

    getDifferenceDays(day1, day2) {
        const diffTime = Math.abs(day1 - day2);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    async findAll(query): Promise<{ data: Submission[]; count: number }> {
        const where = this.queryService.getQueryToFind(Submission, query);
        const [submissions, count] = await this.repository.findAndCount({
            where,
            relations: ['user', 'question'],
            order: { id: 'ASC' },
        });
        return { data: submissions, count };
    }

    async findOne(id: number, query): Promise<Submission> {
        const queryBuild = createQueryBuilder(Submission, 's');
        const entitiesRelation = this.getEntitiesRelation();
        const where = `s.id = '${id}' and ${this.queryService.getQueryToQueryBuilder(entitiesRelation, query)}`;
        const submission = await queryBuild
            .leftJoinAndMapOne('s.user', 's.user', 'su')
            .leftJoinAndMapOne('s.question', 's.question', 'sq')
            .addSelect('s.code')
            .where(where)
            .getOne();

        if (!submission) {
            throw new HttpException({ entity: 'Submission', type: NOT_FOUND }, 404);
        }

        return submission;
    }

    async setUserQuestionList(data: SetUserQuestionListSubmission): Promise<void> {
        const statusOK = QuestionStatus.OK;
        const statusNOK = QuestionStatus.NOK;
        const userQuestionList = await this.getUserQuestionListRepository().findOne({
            where: { questionId: data.questionId, userListId: data.userListId },
        });

        if (userQuestionList) {
            const statusIsOk = userQuestionList.status === statusOK || data.submission.verdict === statusOK;
            const newValue = {
                ...userQuestionList,
                penalty: userQuestionList.penalty > 0 ? userQuestionList.penalty : 0,
                status: statusIsOk ? statusOK : statusNOK,
                count: userQuestionList.count + 1,
            };
            await this.getUserQuestionListRepository().save(newValue);
        } else {
            const newUserQuestionList = {
                questionId: data.questionId,
                userListId: data.userListId,
                status: data.submission.verdict === statusOK ? statusOK : statusNOK,
                count: 1,
                listId: data.listId,
                userId: data.userId,
                penalty: data.penalty,
            };
            this.getUserQuestionListRepository().create(newUserQuestionList);
            await this.getUserQuestionListRepository().save(newUserQuestionList);
        }
    }

    async create(submission: CodeforcesSubmissionDTO, data: SubmissionAssociationDTO): Promise<Submission> {
        const createdTime = new Date(+`${submission.creationTimeSeconds}000`);
        const limitTime = new Date(data.limitTime);

        const exist = await this.repository.findOne({
            where: {
                subId: +submission.id,
                listId: data.listId,
                questionId: data.questionId,
            },
        });

        const dataToSetUserQuestionList = {
            questionId: data.questionId,
            userListId: data.userListId,
            submission: submission,
            userId: data.userId,
            listId: data.listId,
            penalty:
                submission.verdict === 'OK' && createdTime > limitTime
                    ? this.getDifferenceDays(createdTime, limitTime)
                    : 0,
        };

        const existInTesting = exist && exist.status === 'TESTING';
        if (!exist || existInTesting) {
            await this.setUserQuestionList(dataToSetUserQuestionList);
            const sourceCode = await this.getSourceCode(submission.contestId, submission.id);
            const newSubmission = this.repository.create({
                userId: data.userId,
                listId: data.listId,
                subId: +submission.id,
                questionId: data.questionId,
                status: submission.verdict,
                language: submission.programmingLanguage,
                time: submission.timeConsumedMillis,
                code: sourceCode,
                memory: submission.memoryConsumedBytes,
                createdTime: createdTime.toISOString(),
            });
            await this.repository.save(newSubmission);
            return newSubmission;
        }
    }

    async getSourceCode(contestId: string, subId: string) {
        try {
            const url = `${this.BASE_URL}/contest/${contestId}/submission/${subId}`;
            const response = await this.httpService.get(url).toPromise();

            const $ = <any>cheerio.load(response.data);
            const sourceCode = $('.program-source')[0].children[0].data;

            return sourceCode;
        } catch (error) {
            return null;
        }
    }

    // async getUserSubmission(query) {
    //     const where = this.queryService.getQueryToFind(Submission, query);
    //     const submissions = await this.repository.find({ where, relations: ['user', 'question'] });
    //     return submissions;
    // }
}
