import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class UserToken1695855768162 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'user_tokens',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: `uuid_generate_v4()`,
                    },
                    {
                        name: 'user',
                        type: 'uuid',
                    },
                    {
                        name: 'token',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'deletedAt',
                        type: 'timestamp',
                        default: null,
                        isNullable: true,
                    },
                ]
            }),
            true
        )

        await queryRunner.createForeignKey(
            'user_tokens',
            new TableForeignKey({
                columnNames: ['user'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(`user_tokens`);
    }

}
