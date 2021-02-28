import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { Query } from 'typeorm/driver/Query';
import { EntityToQuery } from './dto/entityQuery.dto';

@Injectable()
export class QueryService {
    getQuery(entities: EntityToQuery[], query: Query) {
        let result = '1 = 1';

        for (const att in query) {
            const nick = this.getNickFromAttribute(att, entities);
            if (nick) {
                const attributeValue = query[att];
                const valueIsArray = Array.isArray(attributeValue);
                const operator = valueIsArray ? 'in' : '=';
                const value = valueIsArray ? `(${attributeValue.join(', ')})` : `'${attributeValue}'`;

                result += ` and ${nick}.${att} ${operator} ${value}`;
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
