import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CircuitPlaces1694461650100 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'circuit_places',
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
                    },
                    {
                        name: 'place_id',
                        type: 'uuid',
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
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            'circuit_places',
            new TableForeignKey({
                columnNames: ['circuit_id'],
                referencedTableName: 'circuits',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );

        await queryRunner.createForeignKey(
            'circuit_places',
            new TableForeignKey({
                columnNames: ['place_id'],
                referencedTableName: 'places',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(`circuit_places`);
    }

}
