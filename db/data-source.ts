import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3307,
    username: 'root',
    password: 'S3cret',
    database: 'diet_database',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;