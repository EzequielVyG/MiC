import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm';

export class UserPreferences1698089942098 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'user_preferences',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						default: `uuid_generate_v4()`,
					},
					{
						name: 'userId',
						type: 'uuid',
						isNullable: false,
					},
					{
						name: 'initialContext',
						type: 'varchar',
						isNullable: true,
					},
				],
			}),
			true
		);

		await queryRunner.createForeignKey(
			'user_preferences',
			new TableForeignKey({
				columnNames: ['userId'],
				referencedColumnNames: ['id'],
				referencedTableName: 'users',
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable(`user_preferences`);
	}
}
