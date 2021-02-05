import { EntityRepository, Repository } from 'typeorm';
import { Submission } from './submissions.entity';

@EntityRepository(Submission)
export class QuestionRepository extends Repository<Submission> {}
