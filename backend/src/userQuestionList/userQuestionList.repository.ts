import { EntityRepository, Repository } from 'typeorm';
import { UserQuestionList } from './userQuestionList.entity';

@EntityRepository(UserQuestionList)
export class UserQuestionListRepository extends Repository<UserQuestionList> {}
