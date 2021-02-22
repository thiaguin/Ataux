import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { Parser } from 'json2csv';

@Injectable()
export class CsvService {
    private getDateName() {
        const date = new Date();
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDay();

        return `${year}${month < 10 ? `0${month}` : month}${day < 10 ? `0${day}` : day}`;
    }

    private uploadCSV(csv: any, filename: string, res: Response) {
        res.header('Content-Type', 'text/csv');
        res.attachment(filename);
        res.send(csv);
    }

    getCSV(datas: any[], entityName: string, res: Response) {
        const [headers, ...data] = datas;
        const fields = headers.map((header) => ({ value: header, label: header }));
        const json2csv = new Parser({ fields });
        const csv = json2csv.parse(data);
        const filename = `${entityName}-${this.getDateName()}.csv`;

        return this.uploadCSV(csv, filename, res);
    }
}
