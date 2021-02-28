import { EntityRepository, Repository } from 'typeorm';
import { List } from './lists.entity';

@EntityRepository(List)
export class ListRepository extends Repository<List> {}
