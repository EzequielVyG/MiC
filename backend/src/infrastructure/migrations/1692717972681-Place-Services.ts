import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class PlaceServices1692717972681 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'place_services',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: `uuid_generate_v4()`,
                    },
                    {
                        name: 'place_id',
                        type: 'uuid',
                    },
                    {
                        name: 'service_id',
                        type: 'uuid',
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            'place_services',
            new TableForeignKey({
                columnNames: ['service_id'],
                referencedTableName: 'services',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );

        await queryRunner.createForeignKey(
            'place_services',
            new TableForeignKey({
                columnNames: ['place_id'],
                referencedTableName: 'places',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(`place_services`);
    }

}
