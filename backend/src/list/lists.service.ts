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

@Injectable()
export class ListService {
    @InjectRepository(List)
    private repository: Repository<List>;
    private questionService: QuestionsService;
    private codeforcesService: CodeforcesService;

    constructor() {
        this.questionService = new QuestionsService();
        this.codeforcesService = new CodeforcesService();
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

    async checkSubmissions(id: number, user: PayloadUserDTO) {
        const list = await this.findById(id);
        const contests = {};
        const submissions = {};

        for (const value of list.questions) {
            contests[value.question.contestId] = true;
        }

        for (const contest in contests) {
            submissions[contest] = await this.codeforcesService.getSubmissions(user.handle, contest);
        }

        for (const value of list.questions) {
            const data = {
                handle: user.handle,
                listQuestionId: value.id,
                listId: value.listId,
                questionId: value.questionId,
                submissions: submissions[value.question.contestId],
                userId: user.id,
            };

            await this.questionService.checkSubmissions(value.questionId, data);
        }
    }
}
