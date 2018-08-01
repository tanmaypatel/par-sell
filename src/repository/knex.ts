import * as Knex from 'knex';

import * as knexConfigs from '../knexfile';

const environment: string = process.env.NODE_ENV || 'development';

const knexConfig: Knex.Config = (knexConfigs as any)[environment] as Knex.Config;

const knex: Knex = Knex(knexConfig);

export default knex;
