import { Injectable } from '@nestjs/common';
import { EntityTarget, getConnection, ILike, In, Raw } from 'typeorm';
import { Query } from 'typeorm/driver/Query';
import { EntityToQuery } from './dto/entityQuery.dto';
@Injectable()
export class QueryService {
    getQueryToQueryBuilder(entities: EntityToQuery[], query: Query) {
        let result = '1 = 1';

        for (const att in query) {
            const nick = this.getNickFromAttribute(att, entities);
            if (nick) {
                const attributeValue = query[att];
                const valueIsArray = Array.isArray(attributeValue);
                const operator = valueIsArray ? 'in' : '=';
                const value = valueIsArray ? `(${attributeValue.join(', ')})` : `'${attributeValue}'`;

                if (['name', 'title'].includes(att)) {
                    result += ` and ${nick}.${att} ILIKE '%${attributeValue}%'`;
                } else {
                    result += ` and ${nick}.${att} ${operator} ${value}`;
                }
            }
        }

        return result;
    }

    getQueryToFind(entity: EntityTarget<any>, query: any) {
        const result = {};

        for (const key in query) {
            const columns = getConnection().getMetadata(entity).ownColumns;
            const [column] = columns.filter((el) => el.propertyName === key);

            if (column) {
                if (Array.isArray(query[key])) {
                    result[key] = Array.isArray(query[key]) ? In(query[key]) : query[key];
                } else {
                    switch (column.type) {
                        case Number:
                            result[key] = query[key];
                            break;
                        case String:
                            result[key] = ILike(`%${query[key]}%`);
                            break;
                        default:
                            result[key] = query[key];
                            break;
                    }
                }
            }
        }

        return result;
    }

    private getNickFromAttribute(attributeName: string, entities: EntityToQuery[]): string {
        for (const value of entities) {
            const entityColumns = getConnection().getMetadata(value.entity).ownColumns;
            const entityColumnsName = entityColumns.map((column) => column.propertyName);

            if (entityColumnsName.includes(attributeName)) return value.nick;
        }

        return '';
    }
}
