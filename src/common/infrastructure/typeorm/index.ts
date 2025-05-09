import { DataSource } from 'typeorm';
import { env } from '../env';

export const dataSource = new DataSource({
    type: env.DB_TYPE,
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    username: env.DB_USER,
    password: env.DB_PASS,
    synchronize: false,
    logging: false,
    entities: ['**/entities/**/*.ts'],
    migrations: ['**/entities/**/*.ts'],
    subscribers: [],
});
