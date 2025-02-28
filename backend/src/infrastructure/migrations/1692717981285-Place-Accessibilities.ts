import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm';

export class PlaceAccessibilities1692717981285 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'place_accessibilities',
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
						name: 'accessibility_id',
						type: 'uuid',
					},
				],
			}),
			true
		);

		await queryRunner.createForeignKey(
			'place_accessibilities',
			new TableForeignKey({
				columnNames: ['accessibility_id'],
				referencedTableName: 'accessibilities',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
			})
		);

		await queryRunner.createForeignKey(
			'place_accessibilities',
			new TableForeignKey({
				columnNames: ['place_id'],
				referencedTableName: 'places',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable(`place_accessibilities`);
	}
}
