import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAcceptedAt1621645355430 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const sql = `
            UPDATE "user_question_list" uql
            SET    "acceptedAt" = (
                SELECT Min("createdTime")
                FROM   "submission" s
                WHERE  s."status" = 'OK'
                    AND s."listId" = uql."listId"
                    AND s."userId" = uql."userId"
                    AND s."questionId" = uql."questionId"
            );
        `;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const sql = `
            UPDATE "user_question_list"
            SET    "acceptedAt" = NULL;
        `;

        await queryRunner.query(sql);
    }
}
