import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class OrganizationAddContacts1702915644902 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('organizations', [
            new TableColumn({
                name: 'facebook_url',
                type: 'varchar',
                isNullable: true,
            }),
            new TableColumn({
                name: 'twitter_url',
                type: 'varchar',
                isNullable: true,
            }),
            new TableColumn({
                name: 'instagram_url',
                type: 'varchar',
                isNullable: true,
            }),
            new TableColumn({
                name: 'email',
                type: 'varchar',
                isNullable: true,
            }),
            new TableColumn({
                name: 'web_organization_url',
                type: 'varchar',
                isNullable: true,
            }),
            new TableColumn({
                name: 'description',
                type: 'varchar',
                isNullable: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('organizations', 'facebook_url');
        await queryRunner.dropColumn('organizations', 'twitter_url');
        await queryRunner.dropColumn('organizations', 'instagram_url');
        await queryRunner.dropColumn('organizations', 'email');
        await queryRunner.dropColumn('organizations', 'web_organization_url');
        await queryRunner.dropColumn('organizations', 'description');
    }
}
