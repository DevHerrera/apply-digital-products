import { DataSource } from 'typeorm';
import 'dotenv/config'; // loads .env automatically

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/modules/**/*.entity.js'],
  migrations: ['dist/modules/database/migrations/*.js'],
  synchronize: false,
});
