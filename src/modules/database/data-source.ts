import { DataSource } from 'typeorm';
import 'dotenv/config'; // loads .env automatically

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT ?? '5432'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['src/modules/**/*.entity{.ts,.js}'],
  migrations: ['src/modules/database/migrations/*.ts'],
  synchronize: false,
});
