import 'reflect-metadata';
import { DataSource } from 'typeorm';
import configuration from '../index';
import { join } from 'path';

const db_type = configuration().db.type;
const { host, port, username, password, database } =
  configuration().db[db_type];

export const AppDataSource = new DataSource({
  type: db_type,
  host,
  port,
  username,
  password,
  database,
  entities: [join(__dirname, '../**/*.entity.{ts,js}')],
  migrations: [join(__dirname, '../migrations/*.js')],
  synchronize: false, // 生产必须 false
});
