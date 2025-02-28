import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm';

export class UserFavoriteEvents1698799922976 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'user_favorite_events',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						default: `uuid_generate_v4()`,
					},
					{
						name: 'user_id',
						type: 'uuid',
						isNullable: false,
					},
					{
						name: 'event_id',
						type: 'uuid',
						isNullable: false,
					},
				],
			}),
			true
		);

		await queryRunner.createForeignKey(
			'user_favorite_events',
			new TableForeignKey({
				columnNames: ['user_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'users',
				onDelete: 'CASCADE',
			})
		);

		await queryRunner.createForeignKey(
			'user_favorite_events',
			new TableForeignKey({
				columnNames: ['event_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'events',
				onDelete: 'CASCADE',
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('user_favorite_events');
	}
}
