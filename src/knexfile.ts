import * as _ from 'lodash';
import * as config from 'config';
import { Config } from 'knex';

const GENERAL_CONFIGS: any = {
    migrations: {
        directory: './repository/migrations',
        tableName: 'knex_migrations'
    }
};

const developmentConfig: Config = _.extend(
    {
        client: 'sqlite3',
        connection: {
            filename: config.get('repository.sqlite.filename')
        },
        debug: false,
        useNullAsDefault: true
    },
    GENERAL_CONFIGS
);

const stageConfig: Config = _.extend(
    {
        client: 'pg',
        searchPath: 'public',
        connection: {
            host: config.get('repository.postgres.host'),
            port: config.get('repository.postgres.port'),
            database: config.get('repository.postgres.database'),
            user: config.get('repository.postgres.user'),
            password: config.get('repository.postgres.password')
        },
        pool: {
            min: 2,
            max: 10
        },
        debug: false
    },
    GENERAL_CONFIGS
);

const productionConfig: Config = _.extend(
    {
        client: 'pg',
        searchPath: 'public',
        connection: {
            host: config.get('repository.postgres.host'),
            port: config.get('repository.postgres.port'),
            database: config.get('repository.postgres.database'),
            user: config.get('repository.postgres.user'),
            password: config.get('repository.postgres.password')
        },
        pool: {
            min: 2,
            max: 10
        }
    },
    GENERAL_CONFIGS
);

const knexConfig: { [key: string]: Config } = {
    development: developmentConfig,
    stage: stageConfig,
    production: productionConfig
};

module.exports = knexConfig;
