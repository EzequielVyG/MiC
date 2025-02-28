import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm';

export class PlacePhotos1692220630762 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'place_photos',
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
						name: 'photoUrl',
						type: 'varchar',
					},
				],
			}),
			true
		);

		await queryRunner.createForeignKey(
			'place_photos',
			new TableForeignKey({
				columnNames: ['placeId'],
				referencedColumnNames: ['id'],
				referencedTableName: 'places',
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('place_photos');
	}
}
