import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class EventsAddUrlTicketeraColumn1702411312954 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'events',
            new TableColumn({
                name: 'url_ticketera',
                type: 'varchar',
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('events', 'url_ticketera');
    }

}
