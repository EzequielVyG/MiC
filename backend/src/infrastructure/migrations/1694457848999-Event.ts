import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Event1694457848999 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'events',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: 'uuid_generate_v4()',
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
                        name: 'minors',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'start_date',
                        type: 'timestamp with time zone',
                        isNullable: true,
                    },
                    {
                        name: 'end_date',
                        type: 'timestamp with time zone',
                        isNullable: true,
                    },
                    {
                        name: 'price',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'url',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                    },
                    {
                        name: 'origin',
                        type: 'varchar',
                    },
                    {
                        name: 'place_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
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
            'events',
            new TableForeignKey({
                columnNames: ['principalCategoryId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'categories',
                onDelete: 'SET NULL',
            })
        );

        await queryRunner.createForeignKey(
            'events',
            new TableForeignKey({
                columnNames: ['place_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'places',
                onDelete: 'SET NULL',
            })
        );

        await queryRunner.createForeignKey(
            'events',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users', // Asegúrate de que el nombre de la tabla de usuarios sea correcto
                onDelete: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('events');
    }

}
