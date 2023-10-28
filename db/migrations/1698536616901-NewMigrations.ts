import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigrations1698536616901 implements MigrationInterface {
    name = 'NewMigrations1698536616901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`diet\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`diet\``);
    }

}
