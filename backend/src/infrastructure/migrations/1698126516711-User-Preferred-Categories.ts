import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm';

export class UserPreferredCategories1698126516711
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'user_preferred_categories',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						default: `uuid_generate_v4()`,
					},
					{
						name: 'user_preference_id',
						type: 'uuid',
						isNullable: false,
					},
					{
						name: 'category_id',
						type: 'uuid',
						isNullable: false,
					},
				],
			}),
			true
		);
		/* await queryRunner.createForeignKey(
			'user_preferred_categories',
			new TableForeignKey({
				columnNames: ['user_preference_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'user_preferences',
				onDelete: 'CASCADE',
			})
		); */

		await queryRunner.createForeignKey(
			'user_preferred_categories',
			new TableForeignKey({
				columnNames: ['category_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'categories',
				onDelete: 'CASCADE',
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('user_preferred_categories');
	}
}
