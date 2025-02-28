import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class Translator1694624243241 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: 'translators',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: `uuid_generate_v4()`,
                    },
                    {
                        name: 'entity',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'identificador',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'campo',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'idioma',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'traduccion',
                        type: 'varchar',
                        isNullable: false,
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(`translators`);
    }

}
