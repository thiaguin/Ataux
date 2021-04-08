import { EntityRepository, Repository } from 'typeorm';
import { UserList } from './userList.entity';

@EntityRepository(UserList)
export class UserListRepository extends Repository<UserList> {}
