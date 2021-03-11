import * as cheerio from 'cheerio';
import { HttpService, Injectable } from '@nestjs/common';
import { getCustomRepository, getManager, Repository } from 'typeorm';
import { Submission } from './submissions.entity';
import { SubmissionRepository } from './submissions.repository';
import { CodeforcesSubmissionDTO } from 'src/codeforces/dto/codeforces-submission.dto';
import { SubmissionAssociationDTO } from './submission-associations.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserQuestionList } from 'src/userQuestionList/userQuestionList.entity';
import { SetUserQuestionListSubmission } from './dto/setUserQuestionList-submission.dto';
import { QuestionStatus } from 'src/enums/questionStatus.enum';

@Injectable()
export class SubmissionsService {
    @InjectRepository(Submission)
    private repository: Repository<Submission>;
    private httpService: HttpService;
    private BASE_URL: string;

    constructor() {
        this.repository = getCustomRepository(SubmissionRepository);
        this.httpService = new HttpService();
        this.BASE_URL = 'http://codeforces.com';
    }

    getUserQuestionListRepository(): Repository<UserQuestionList> {
        return getManager().getRepository(UserQuestionList);
    }

    async findAll(query): Promise<Submission[]> {
        const submissions = await this.repository.find(query);
        return submissions;
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
        };

        if (!exist && createdTime <= limitTime) {
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
            });
            await this.repository.save(newSubmission);
            return newSubmission;
        }
    }

    async getSourceCode(contestId: string, subId: string) {
        const url = `${this.BASE_URL}/contest/${contestId}/submission/${subId}`;
        const response = await this.httpService.get(url).toPromise();

        const $ = <any>cheerio.load(response.data);
        const sourceCode = $('.program-source')[0].children[0].data;

        return sourceCode;
    }

    async getUserSubmission(query) {
        const submissions = await this.repository.find({ where: query, relations: ['user'] });
        return submissions;
    }
}
