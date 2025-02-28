import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class OrganizationOperatorsAddTimestampsColumns1701448692939 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.addColumn(
            'organization_users',
            new TableColumn({
                name: 'createdAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP(6)',
                isNullable: true
            })
        );

        // Agregar la columna updatedAt
        await queryRunner.addColumn(
            'organization_users',
            new TableColumn({
                name: 'updatedAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP(6)',
                onUpdate: 'CURRENT_TIMESTAMP(6)',
                isNullable: true
            })
        );

        // Agregar la columna deletedAt
        await queryRunner.addColumn(
            'organization_users',
            new TableColumn({
                name: 'deletedAt',
                type: 'timestamp',
                isNullable: true,
                default: null,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir la adición de las columnas en orden inverso

        // Eliminar la columna deletedAt
        await queryRunner.dropColumn('organization_users', 'deletedAt');

        // Eliminar la columna updatedAt
        await queryRunner.dropColumn('organization_users', 'updatedAt');

        // Eliminar la columna createdAt
        await queryRunner.dropColumn('organization_users', 'createdAt');
    }

}
