import { EntityRepository, Repository } from 'typeorm';
import { Question } from './questions.entity';

@EntityRepository(Question)
export class QuestionRepository extends Repository<Question> {}
