import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, getCustomRepository, getManager, Repository } from 'typeorm';
import { Question } from './questions.entity';
import { QuestionRepository } from './questions.repository';
import { CreateQuestionDTO } from './dto/create-question.dto';
import { UpdateQuestionDTO } from './dto/update-question.dto';
import { QueryQuestionDTO } from './dto/query-question.dto';
import { FindAllQuestionDTO } from './dto/findAll-questions.dto';
import { QuestionTag } from 'src/questionTags/questionTags.entity';
import { CodeforcesService } from 'src/codeforces/codeforces.service';
import { QuestionLevel } from 'src/enums/questionLevel.enum';
import { TagsService } from 'src/tags/tags.service';
import { Tag } from 'src/tags/tags.entity';
import { NewQuestionDTO } from './dto/new-question.dto';
import { AddQuestionsByContestResult } from './dto/addByContest-result.dto';
import { PaginateService } from 'src/utils/paginate.service';
import { QueryService } from 'src/utils/query.service';
import { EntityToQuery } from 'src/utils/dto/entityQuery.dto';
import { Query } from 'typeorm/driver/Query';
import { BAD_REQUEST, NOT_FOUND, NOT_UNIQUE } from 'src/resource/errorType.resource';

@Injectable()
export class QuestionsService {
    @InjectRepository(Question)
    private repository: Repository<Question>;
    private codeforcesService: CodeforcesService;
    private tagService: TagsService;
    private paginateService: PaginateService;
    private queryService: QueryService;

    constructor() {
        this.repository = getCustomRepository(QuestionRepository);
        this.codeforcesService = new CodeforcesService();
        this.tagService = new TagsService();
        this.paginateService = new PaginateService();
        this.queryService = new QueryService();
    }

    getInfoByURL(url: string): { contestId: string; problemId: string } {
        const SEPARATOR = 'codeforces.com/';
        const CONTEST = 'contest';
        const PROBLEM = 'problem';
        const PROBLEMSET = 'problemset';

        const [, body] = url.split(SEPARATOR);
        const bodyArray = body ? body.split('/') : [];

        if (bodyArray.length === 4) {
            const [el1, el2, el3, el4] = bodyArray;

            const pattern1 = el1 === CONTEST && el3 === PROBLEM;
            const pattern2 = el1 === PROBLEMSET && el2 === PROBLEM;

            if (pattern1 || pattern2) {
                return pattern1 ? { contestId: el2, problemId: el4 } : { contestId: el3, problemId: el4 };
            }
        }

        throw new HttpException({ entity: 'CodeforcesUrl', type: BAD_REQUEST }, 400);
    }

    getContestByURL(url: string): string {
        const SEPARATOR = 'codeforces.com/';
        const CONTEST = 'contest/';

        const [, body] = url.split(SEPARATOR);
        const [, aux] = body ? body.split(CONTEST) : ['', ''];

        const [result] = aux ? aux.split('/') : [''];
        return result;
    }

    getMissedTags(createdTags: Tag[], allTags: string[]): string[] {
        const createds = {};

        for (const createdTag of createdTags) {
            createds[createdTag.name] = true;
        }

        return allTags.filter((tag) => !createds[tag]);
    }

    getEntitiesRelation(): EntityToQuery[] {
        return [
            { entity: Question, nick: 'q' },
            { entity: QuestionTag, nick: 'qt' },
            { entity: Tag, nick: 't' },
        ];
    }

    async findAndCountAll(query: QueryQuestionDTO): Promise<FindAllQuestionDTO> {
        const page = this.paginateService.getPage(query);
        const queryBuild = createQueryBuilder(Question, 'q');
        const entitiesRelation = this.getEntitiesRelation();
        const where = this.queryService.getQueryToQueryBuilder(entitiesRelation, <Query>query);

        const [questions, count] = await queryBuild
            .leftJoinAndMapMany('q.tags', 'q.tags', 'qt')
            .leftJoinAndMapMany('qt.tag', 'qt.tag', 't')
            .where(where)
            .take(page.take)
            .skip(page.skip)
            .getManyAndCount();

        return { data: questions, count };
    }

    async findOne(query: QueryQuestionDTO): Promise<Question> {
        const question = await this.repository.findOne({
            where: query,
            relations: ['tags', 'tags.tag'],
        });

        if (question) {
            return question;
        }
    }

    async findById(id: number): Promise<Question> {
        const question = await this.findOne({ id });

        if (question) {
            return question;
        }

        throw new HttpException({ entity: 'Question', type: NOT_FOUND }, 404);
    }

    async findByURL(url: string): Promise<Question> {
        const { contestId, problemId } = this.getInfoByURL(url);
        const question = await this.findOne({ contestId, problemId });

        if (question) {
            return question;
        }

        throw new HttpException({ entity: 'Question', type: NOT_FOUND }, 404);
    }

    async generateNewQuestion(url: string): Promise<NewQuestionDTO> {
        const { contestId, problemId } = this.getInfoByURL(url);
        const contest = await this.codeforcesService.getContest(contestId);
        const problem = this.codeforcesService.getProblem(contest, problemId);

        const question = await this.findOne({ contestId, problemId });

        if (question) {
            throw new HttpException({ entity: 'Question', type: NOT_UNIQUE }, 409);
        }

        return {
            url: url,
            contestId: contestId,
            problemId: problemId,
            // TODO: Calculate level
            level: QuestionLevel.MEDIUM,
            title: problem.name,
            tags: problem.tags,
        };
    }

    async addContestQuestions(url: string): Promise<AddQuestionsByContestResult> {
        const { contestId, problemId } = this.getInfoByURL(url);
        const contest = await this.codeforcesService.getContest(contestId);
        const result: AddQuestionsByContestResult = { resume: { SUCCESS: [], ERROR: [] } };

        for (const question of contest.problems) {
            try {
                const newQuestion = {
                    url: `https://codeforces.com/contest/${contestId}/problem/${question.index}`,
                    contestId: contestId,
                    problemId: question.index,
                    // TODO: Calculate level
                    level: QuestionLevel.MEDIUM,
                    title: question.name,
                    tags: question.tags,
                };

                const currQuestion = await this.repository.findOne({ where: { contestId, problemId: question.index } });
                const notUniqueError = { entity: 'Question', type: NOT_UNIQUE };
                if (currQuestion) {
                    result.resume.ERROR.push({ questionId: question.index, error: notUniqueError });
                    if (currQuestion.problemId === problemId) {
                        result.question = { questionId: `${currQuestion.id}`, error: notUniqueError };
                    }
                } else {
                    const questionCreated = await this.createQuestion(newQuestion);
                    if (questionCreated.problemId === problemId)
                        result.question = { questionId: `${questionCreated.id}` };
                    result.resume.SUCCESS.push(question.index);
                }
            } catch (error) {
                result.resume.ERROR.push({
                    questionId: question.index,
                    error: { entity: 'Question', type: error.message },
                });

                if (question.index === problemId) {
                    result.question = {
                        questionId: null,
                        error: { entity: 'Question', type: error.message },
                    };
                }
            }
        }

        return result;
    }

    async createQuestion(question: NewQuestionDTO): Promise<Question> {
        return await getManager().transaction(async (transactionManager) => {
            const { tags, ...newQuestion } = question;
            const entity = transactionManager.create(Question, newQuestion);

            await transactionManager.save(entity);

            const currentTags = await this.tagService.findMany(tags);
            const missedTags = this.getMissedTags(currentTags, tags);

            if (missedTags.length > 0) {
                const newTags = await this.tagService.createMany(missedTags);
                await transactionManager.save(Tag, newTags);
                currentTags.push(...newTags);
            }

            const questionTags = currentTags.map((tag) => {
                const questionTag = { questionId: entity.id, tagId: tag.id };
                return transactionManager.create(QuestionTag, questionTag);
            });

            await transactionManager.save(questionTags);
            return entity;
        });
    }

    async create(body: CreateQuestionDTO): Promise<Question> {
        const question = await this.generateNewQuestion(body?.url);
        return this.createQuestion(question);
    }

    async update(id: number, body: UpdateQuestionDTO): Promise<void> {
        const { tags, ...questionBody } = body;
        const questionTags = tags || [];
        const question = await this.repository.findOne({
            where: { id },
        });

        if (!question) {
            throw new HttpException('NOT_FOUND', 404);
        }

        return await getManager().transaction(async (transaction) => {
            await transaction.update(Question, { id }, questionBody);
            await transaction.delete(QuestionTag, { questionId: id });
            const newQuestionTags = questionTags.map((tagId) => {
                return transaction.create(QuestionTag, { questionId: id, tagId: tagId });
            });
            await transaction.save(newQuestionTags);
        });
    }

    async remove(id: number): Promise<void> {
        const question = await this.repository.findOne({ where: { id } });

        if (!question) {
            throw new HttpException('NOT_FOUND', 404);
        }

        this.repository.delete(id);
    }
}
