import { DataSourceOptions } from 'typeorm';
import { envConfig } from './env.config';

require('dotenv').config();

class DbConfig {
  public getTypeOrmConfig(): DataSourceOptions {
    return {
      type: 'postgres',
      host: envConfig.database.db_host,
      port: parseInt(envConfig.database.db_port),
      username: envConfig.database.db_user,
      password: envConfig.database.db_password,
      database: envConfig.database.db_databse,
      synchronize: true, // Always false in production
      logging: true,
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/migration/*.js'],
      migrationsTableName: 'migrations',
      ssl: { rejectUnauthorized: false },
    };
  }
}

const dbconfig = new DbConfig();

export { dbconfig };
