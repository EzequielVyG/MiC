import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm';

export class Place1692220630760 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'places',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						default: `uuid_generate_v4()`,
					},
					{
						name: 'name',
						type: 'varchar',
					},
					{
						name: 'description',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'note',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'url',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'facebook_url',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'twitter_url',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'instagram_url',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'cmi',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'phone',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'domicile',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'origin',
						type: 'varchar',
					},
					{
						name: 'location',
						type: 'geography(Point)',
						isNullable: true,
					},
					{
						name: 'principalCategoryId',
						type: 'uuid',
						isNullable: true,
					},
					{
						name: 'minors',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'organizationId',
						type: 'uuid',
						isNullable: true,
					},
				],
			}),
			true
		);

		await queryRunner.createForeignKey(
			'places',
			new TableForeignKey({
				columnNames: ['principalCategoryId'],
				referencedColumnNames: ['id'],
				referencedTableName: 'categories',
				onDelete: 'CASCADE',
			})
		);

		await queryRunner.createForeignKey(
			'places',
			new TableForeignKey({
				name: 'organization',
				columnNames: ['organizationId'],
				referencedColumnNames: ['id'],
				referencedTableName: 'organizations',
				onDelete: 'CASCADE',
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable(`places`);
	}
}
