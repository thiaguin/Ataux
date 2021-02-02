import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getCustomRepository, getManager, Repository } from 'typeorm';
import { Question } from './questions.entity';
import { QuestionRepository } from './questions.repository';
import { CreateQuestionDTO } from './dto/create-question.dto';
import { UpdateQuestionDTO } from './dto/update-question.dto';
import { QueryQuestionDTO } from './dto/query-question.dto';
import { FindAllQuestionDTO } from './dto/findAll-questions.dto';
import { QuestionTag } from 'src/questionTags/questionTags.entity';

@Injectable()
export class QuestionsService {
    @InjectRepository(Question)
    private repository: Repository<Question>;

    constructor() {
        this.repository = getCustomRepository(QuestionRepository);
    }

    async findAndCountAll(query: QueryQuestionDTO): Promise<FindAllQuestionDTO> {
        const [questions, count] = await this.repository.findAndCount({
            where: { ...query },
        });

        return { data: questions, count };
    }

    async findById(id: number): Promise<Question> {
        const question = await this.repository.findOne({ where: { id } });

        if (question) {
            return question;
        }

        throw new HttpException('NotFound', 404);
    }

    async create(body: CreateQuestionDTO): Promise<Question> {
        return await getManager().transaction(async (transactionManager) => {
            const { tags, ...questionBody } = body;
            const entity = transactionManager.create(Question, questionBody);

            await transactionManager.save(entity);

            const questionTags = tags.map((tag) =>
                transactionManager.create(QuestionTag, {
                    questionId: entity.id,
                    tagId: tag,
                }),
            );

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
