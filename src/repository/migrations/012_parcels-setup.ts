import * as Knex from 'knex';
import * as Bluebird from 'bluebird';
import { CreateTableBuilder, SchemaBuilder } from 'knex';

import { logger } from '../../logging/logger';
import { ParcelsRepository } from '../../parcels/repositories/parcels.repository';
import { UsersRepository } from '../../auth/repositories/users.repository';

async function createParcelsTable(knex: Knex): Promise<SchemaBuilder> {
    return Bluebird.resolve()
        .then(() => {
            return knex.schema.createTableIfNotExists(ParcelsRepository.TABLE_NAME, (table: CreateTableBuilder) => {
                table.uuid('parcelId').notNullable().primary();
                table.string('name').notNullable().unique();
                table.string('culture').notNullable();
                table.float('areaInSquareFeet').notNullable();
                table.uuid('createdBy').references('userId').inTable(UsersRepository.TABLE_NAME).notNullable();
                table.timestamp('createdAt').notNullable();
                table.uuid('updatedBy').references('userId').inTable(UsersRepository.TABLE_NAME).notNullable();
                table.timestamp('updatedAt').notNullable();
            });
        })
        .tap(() => {
            logger.info(`${ParcelsRepository.TABLE_NAME} table created`);
        });
}

async function up(knex: Knex): Promise<boolean> {
    await createParcelsTable(knex);

    return true;
}

async function down(knex: Knex): Promise<boolean> {
    return Promise.resolve(true);
}

module.exports = {
    up: up,
    down: down
};

