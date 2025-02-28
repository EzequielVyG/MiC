import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CircuitCategories1696880853104 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'circuit_categories',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: `uuid_generate_v4()`,
                    },
                    {
                        name: 'circuit_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'category_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            'circuit_categories',
            new TableForeignKey({
                columnNames: ['circuit_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'circuits',
                onDelete: 'CASCADE',
            })
        );

        await queryRunner.createForeignKey(
            'circuit_categories',
            new TableForeignKey({
                columnNames: ['category_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'categories',
                onDelete: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('circuit_categories');
    }


}
