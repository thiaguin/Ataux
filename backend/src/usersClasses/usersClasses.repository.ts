import { EntityRepository, Repository } from 'typeorm';
import { UserClass } from './usersClasses.entity';

@EntityRepository(UserClass)
export class UserClassRepository extends Repository<UserClass> {}
