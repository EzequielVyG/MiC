import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTimestampsToPlaces1700845732998 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('places', [
            new TableColumn({
                name: 'createdAt',
                type: 'timestamp',
                default: 'now()',
            }),
            new TableColumn({
                name: 'updatedAt',
                type: 'timestamp',
                default: 'now()',
            }),
            new TableColumn({
                name: 'deletedAt',
                type: 'timestamp',
                isNullable: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('places', 'createdAt');
        await queryRunner.dropColumn('places', 'updatedAt');
        await queryRunner.dropColumn('places', 'deletedAt');
    }
}
