import { Body, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getCustomRepository, getManager, Repository } from 'typeorm';
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
import { SubmissionsService } from 'src/submissions/submissions.service';
import { SubmissionAssociationDTO } from 'src/submissions/submission-associations.dto';
import { CheckSubmissionQuestionDTO } from './dto/checkSubmission-question.dto';

@Injectable()
export class QuestionsService {
    @InjectRepository(Question)
    private repository: Repository<Question>;
    private codeforcesService: CodeforcesService;
    private submissionService: SubmissionsService;
    private tagService: TagsService;

    constructor() {
        this.repository = getCustomRepository(QuestionRepository);
        this.codeforcesService = new CodeforcesService();
        this.tagService = new TagsService();
        this.submissionService = new SubmissionsService();
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

        throw new HttpException('BadRequest', 400);
    }

    getMissedTags(createdTags: Tag[], allTags: string[]): string[] {
        const createds = {};

        for (const createdTag of createdTags) {
            createds[createdTag.name] = true;
        }

        return allTags.filter((tag) => !createds[tag]);
    }

    async findAndCountAll(query: QueryQuestionDTO): Promise<FindAllQuestionDTO> {
        const [questions, count] = await this.repository.findAndCount({
            where: { ...query },
        });

        return { data: questions, count };
    }

    async findOne(query: QueryQuestionDTO): Promise<Question> {
        const question = await this.repository.findOne({
            where: query,
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

        throw new HttpException('NotFound', 404);
    }

    async findByURL(url: string): Promise<Question> {
        const { contestId, problemId } = this.getInfoByURL(url);
        const question = await this.findOne({ contestId, problemId });

        if (question) {
            return question;
        }

        throw new HttpException('NotFound', 404);
    }

    async generateNewQuestion(url: string): Promise<NewQuestionDTO> {
        const { contestId, problemId } = this.getInfoByURL(url);
        const contest = await this.codeforcesService.getContest(contestId);
        const problem = this.codeforcesService.getProblem(contest, problemId);

        const question = await this.findOne({ contestId, problemId });

        if (question) {
            throw new HttpException('NotUnique', 409);
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

    async create(body: CreateQuestionDTO) {
        return await getManager().transaction(async (transactionManager) => {
            const { tags, ...newQuestion } = await this.generateNewQuestion(body?.url);
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

    async update(id: number, body: UpdateQuestionDTO): Promise<void> {
        const question = await this.repository.findOne({
            where: { id },
        });

        if (!question) {
            throw new HttpException('NotFound', 404);
        }

        await this.repository.update({ id }, body);
    }

    async remove(id: number): Promise<void> {
        const question = await this.repository.findOne({ where: { id } });

        if (!question) {
            throw new HttpException('NotFound', 404);
        }

        this.repository.delete(id);
    }
}
