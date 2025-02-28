import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm';

export class Categories1691174921293 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'categories',
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
						name: 'father',
						type: 'uuid',
						isNullable: true,
					},
					{
						name: 'group',
						type: 'varchar',
					},
					{
						name: 'color',
						type: 'varchar',
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
			'categories',
			new TableForeignKey({
				columnNames: ['father'],
				referencedTableName: 'categories',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable(`categories`);
	}
}
