import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class OrganizationUsersAddStatus1701444286466 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'organization_users',
            new TableColumn({
                name: 'status',
                type: 'varchar',
                isNullable: true
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('organization_users', 'status');
    }

}
