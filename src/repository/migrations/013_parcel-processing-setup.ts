import * as Knex from 'knex';
import * as Bluebird from 'bluebird';
import { CreateTableBuilder, SchemaBuilder } from 'knex';

import { logger } from '../../logging/logger';
import { ParcelsProcessingRepository } from '../../parcels/repositories/parcels-processing.repository';
import { UsersRepository } from '../../auth/repositories/users.repository';
import { ParcelsRepository } from '../../parcels/repositories/parcels.repository';
import { TractorsRepository } from '../../tractors/repositories/tractors.repository';

async function createParcelsProcessingTable(knex: Knex): Promise<SchemaBuilder> {
    return Bluebird.resolve()
        .then(() => {
            return knex.schema.createTableIfNotExists(ParcelsProcessingRepository.TABLE_NAME, (table: CreateTableBuilder) => {
                table.uuid('processingId').notNullable().primary();
                table.uuid('parcelId').references('parcelId').inTable(ParcelsRepository.TABLE_NAME).notNullable();
                table.uuid('tractorId').references('tractorId').inTable(TractorsRepository.TABLE_NAME).notNullable();
                table.date('date').notNullable().unique();
                table.float('occupiedAreaInSquareFeet').notNullable();
                table.uuid('createdBy').references('userId').inTable(UsersRepository.TABLE_NAME).notNullable();
                table.timestamp('createdAt').notNullable();
                table.uuid('updatedBy').references('userId').inTable(UsersRepository.TABLE_NAME).notNullable();
                table.timestamp('updatedAt').notNullable();
            });
        })
        .tap(() => {
            logger.info(`${ParcelsProcessingRepository.TABLE_NAME} table created`);
        });
}

async function up(knex: Knex): Promise<boolean> {
    await createParcelsProcessingTable(knex);

    return true;
}

async function down(knex: Knex): Promise<boolean> {
    return Promise.resolve(true);
}

module.exports = {
    up: up,
    down: down
};

