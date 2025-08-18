import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductsTable1755231045119 implements MigrationInterface {
  name = 'CreateProductsTable1755231045119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "products" ("sku" character varying NOT NULL, "name" character varying NOT NULL, "brand" character varying NOT NULL, "model" character varying NOT NULL, "category" character varying NOT NULL, "color" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "currency" character varying(3) NOT NULL, "stock" integer NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_c44ac33a05b144dd0d9ddcf9327" PRIMARY KEY ("sku"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "products"`);
  }
}
