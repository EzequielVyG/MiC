import { DataSource, DataSourceOptions } from 'typeorm';

require('dotenv').config();

const {
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
} = process.env;

const options: DataSourceOptions = {
  type: 'postgres',
  host: "localhost",
  port: parseInt(DATABASE_PORT, 10),
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  entities: [__dirname + '/**/infrastructure/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/**/migrations/*.ts'],
  migrationsTableName: "migrations",
};

export const dataSource = new DataSource(options);
