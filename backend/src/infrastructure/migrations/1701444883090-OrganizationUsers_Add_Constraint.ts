import { MigrationInterface, QueryRunner } from "typeorm"

export class OrganizationUsersAddConstraint1701444883090 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE organization_users ALTER COLUMN status SET NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE organization_users ALTER COLUMN status DROP NOT NULL`
        );
    }

}
