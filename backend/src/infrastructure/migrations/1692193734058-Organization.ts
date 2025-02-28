import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm';

export class Organization1692193734058 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'organizations',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						default: `uuid_generate_v4()`,
					},
					{
						name: 'legalName',
						type: 'varchar',
					},
					{
						name: 'address',
						type: 'varchar',
					},
					{
						name: 'cuit',
						type: 'varchar',
					},
					{
						name: 'cmi',
						type: 'varchar',
					},
					{
						name: 'phone',
						type: 'varchar',
					},
					{
						name: 'owner',
						type: 'uuid',
						isNullable: true,
					},
					{
						name: 'status',
						type: 'varchar',
					},
					{
						name: 'validator',
						type: 'uuid',
						isNullable: true,
					},
					{
						name: 'principalCategoryId',
						type: 'uuid',
						isNullable: true,
					},
					{
						name: 'createdAt',
						type: 'timestamp',
						default: 'now()',
					},
					{
						name: 'updatedAt',
						type: 'timestamp',
						default: 'now()',
					},
					{
						name: 'deletedAt',
						type: 'timestamp',
						default: null,
						isNullable: true,
					},
				],
			}),
			true
		);

		await queryRunner.createForeignKey(
			'organizations',
			new TableForeignKey({
				columnNames: ['owner'],
				referencedTableName: 'users',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			})
		);

		await queryRunner.createForeignKey(
			'organizations',
			new TableForeignKey({
				columnNames: ['validator'],
				referencedTableName: 'users',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			})
		);

		await queryRunner.createForeignKey(
			'organizations',
			new TableForeignKey({
				columnNames: ['principalCategoryId'],
				referencedColumnNames: ['id'],
				referencedTableName: 'categories',
				onDelete: 'CASCADE',
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable(`organizations`);
	}
}
