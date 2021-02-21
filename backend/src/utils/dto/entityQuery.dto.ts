import { EntityTarget } from 'typeorm';

export class EntityToQuery {
    entity: EntityTarget<any>;
    nick: string;
}
