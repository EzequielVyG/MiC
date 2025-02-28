import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class EventFlyerss1694457860169 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'event_flyers',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: `uuid_generate_v4()`,
                    },
                    {
                        name: 'event_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'flyerUrl',
                        type: 'varchar',
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            'event_flyers',
            new TableForeignKey({
                columnNames: ['event_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'events',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('event_flyers');
    }

}
