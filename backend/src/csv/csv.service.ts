import { Injectable, ParseArrayPipe } from '@nestjs/common';
import { Response } from 'express';
import { ClassesService } from 'src/classes/classes.service';
import { Parser } from 'json2csv';
import { ListService } from 'src/list/lists.service';

@Injectable()
export class CsvService {
    private getDateName() {
        const date = new Date();
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDay();

        return `${year}${month < 10 ? `0${month}` : month}${day < 10 ? `0${day}` : day}`;
    }

    private transform(headers: string[], data: string[][]): any {
        const fields = headers.map((header) => ({ value: header, label: header }));
        const json2csv = new Parser({ fields });
        const rows = [];

        for (const value of data) {
            const row = {};

            for (const index in value) {
                row[headers[index]] = value[index];
            }

            rows.push(row);
        }

        return json2csv.parse(rows);
    }

    private uploadCSV(csv: any, filename: string, res: Response) {
        res.header('Content-Type', 'text/csv');
        res.attachment(filename);
        res.send(csv);
    }

    async getClass(classId: number, res: Response) {
        const classService = new ClassesService();
        const entity = await classService.findById(classId);
        const [headers, ...body] = await classService.getToCSV(classId);

        const csv = this.transform(headers, body);
        const filename = `${entity.name}-${this.getDateName()}.csv`;

        return this.uploadCSV(csv, filename, res);
    }

    async getList(listId: number, res: Response) {
        const listService = new ListService();
        const list = await listService.findById(listId);
        const [headers, ...body] = await listService.getToCSV(listId);

        const csv = this.transform(headers, body);
        const filename = `${list.title}-${this.getDateName()}.csv`;

        return this.uploadCSV(csv, filename, res);
    }
}
