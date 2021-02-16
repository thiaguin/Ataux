import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListQuestion } from 'src/listQuestion/listQuestion.entity';
import { QuestionsService } from 'src/questions/questions.service';
import { QuestionTag } from 'src/questionTags/questionTags.entity';
import { getCustomRepository, getRepository, Repository } from 'typeorm';
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

    async create(body: CreateListDTO): Promise<List> {
        const newList = this.repository.create(body);
        await this.repository.save(newList);
        return newList;
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

    async checkSubmissions(id: number, user: PayloadUserDTO, body: CheckSubmissionListDTO) {
        const currUser = body.user || user;
        const list = await this.findById(id);
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
            };

            for (const submission of submissions[value.question.contestId]) {
                await this.submissionService.create(submission, data);
            }
        }
    }
}
