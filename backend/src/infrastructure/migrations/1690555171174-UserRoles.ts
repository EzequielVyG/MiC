import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm';

export class UserRoles1690555171174 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'user_roles',
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
					},
					{
						name: 'role_id',
						type: 'uuid',
					},
				],
			}),
			true
		);

		await queryRunner.createForeignKey(
			'user_roles',
			new TableForeignKey({
				columnNames: ['user_id'],
				referencedTableName: 'users',
				referencedColumnNames: ['id'],
			})
		);

		await queryRunner.createForeignKey(
			'user_roles',
			new TableForeignKey({
				columnNames: ['role_id'],
				referencedTableName: 'roles',
				referencedColumnNames: ['id'],
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable(`user_roles`);
	}
}
