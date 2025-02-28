import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UserAccountAddAccountID1701269893315 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "user_accounts",
            new TableColumn({
                name: "account_id",
                type: "varchar",
                isNullable: true,
                default: null,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user_accounts", "account_id");
    }

}
