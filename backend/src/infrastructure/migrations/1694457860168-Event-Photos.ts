import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class EventPhotos1694457860168 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'event_photos',
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
                        name: 'photoUrl',
                        type: 'varchar',
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            'event_photos',
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
        await queryRunner.dropTable('event_photos');
    }

}
