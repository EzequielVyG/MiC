import { MigrationInterface, QueryRunner } from "typeorm"

export class OrganizationUsersSetStatus1701444402059 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `UPDATE organization_users SET status = 'ACCEPTED'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `UPDATE organization_users SET status = NULL` // O el valor original antes de la actualización
        );
    }
}
