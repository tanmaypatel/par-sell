import * as Knex from 'knex';
import * as Bluebird from 'bluebird';
import { CreateTableBuilder, SchemaBuilder } from 'knex';

import { logger } from '../../logging/logger';
import { TractorsRepository } from '../../tractors/repositories/tractors.repository';
import { UsersRepository } from '../../auth/repositories/users.repository';

async function createTractorsTable(knex: Knex): Promise<SchemaBuilder> {
    return Bluebird.resolve()
        .then(() => {
            return knex.schema.createTableIfNotExists(TractorsRepository.TABLE_NAME, (table: CreateTableBuilder) => {
                table.uuid('tractorId').notNullable().primary();
                table.string('name').notNullable().unique();
                table.boolean('isActive').notNullable();
                table.uuid('createdBy').references('userId').inTable(UsersRepository.TABLE_NAME).notNullable();
                table.timestamp('createdAt').notNullable();
                table.uuid('updatedBy').references('userId').inTable(UsersRepository.TABLE_NAME).notNullable();
                table.timestamp('updatedAt').notNullable();
            });
        })
        .tap(() => {
            logger.info(`${TractorsRepository.TABLE_NAME} table created`);
        });
}

async function up(knex: Knex): Promise<boolean> {
    await createTractorsTable(knex);

    return true;
}

async function down(knex: Knex): Promise<boolean> {
    return Promise.resolve(true);
}

module.exports = {
    up: up,
    down: down
};

