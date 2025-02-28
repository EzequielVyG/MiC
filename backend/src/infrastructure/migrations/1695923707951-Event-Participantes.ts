import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from 'typeorm';

export class EventParticipantes1695923707951 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'event_participants',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: `uuid_generate_v4()`,
                    },
                    {
                        name: 'eventId',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'organizationId',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'role',
                        type: 'varchar',
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            'event_participants',
            new TableForeignKey({
                columnNames: ['eventId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'events',
                onDelete: 'CASCADE',
            })
        );

        await queryRunner.createForeignKey(
            'event_participants',
            new TableForeignKey({
                columnNames: ['organizationId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'organizations',
                onDelete: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('event_participants');
    }

}
