import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm';

export class PlaceSchedule1692220630761 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'place_schedules',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						default: `uuid_generate_v4()`,
					},
					{
						name: 'placeId',
						type: 'uuid',
						isNullable: false,
					},
					{
						name: 'dayOfWeekId',
						type: 'uuid',
						isNullable: false,
					},
					{
						name: 'openingHour',
						type: 'time',
					},
					{
						name: 'closingHour',
						type: 'time',
					},
				],
			}),
			true
		);

		await queryRunner.createForeignKey(
			'place_schedules',
			new TableForeignKey({
				columnNames: ['placeId'],
				referencedColumnNames: ['id'],
				referencedTableName: 'places',
				onDelete: 'CASCADE',
			})
		);

		await queryRunner.createForeignKey(
			'place_schedules',
			new TableForeignKey({
				columnNames: ['dayOfWeekId'],
				referencedColumnNames: ['id'],
				referencedTableName: 'days_of_weeks',
				onDelete: 'CASCADE',
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('place_schedules');
	}
}
