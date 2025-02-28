import { MigrationInterface, QueryRunner } from "typeorm"

export class EventsDeleteCmiPhoneColumns1702411111099 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE events DROP COLUMN phone`);

        await queryRunner.query(`ALTER TABLE events DROP COLUMN cmi`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir la eliminación de las columnas en orden inverso

        await queryRunner.query(`ALTER TABLE events ADD COLUMN cmi varchar`);

        await queryRunner.query(`ALTER TABLE events ADD COLUMN phone varchar`);
    }
}
