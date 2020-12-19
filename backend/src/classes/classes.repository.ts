import { EntityRepository, Repository } from 'typeorm';
import { Class } from './classes.entity';

@EntityRepository(Class)
export class ClassRepository extends Repository<Class> {}
