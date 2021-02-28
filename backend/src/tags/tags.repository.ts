import { EntityRepository, Repository } from 'typeorm';
import { Tag } from './tags.entity';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {}
