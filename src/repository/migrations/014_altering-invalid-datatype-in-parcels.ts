import * as Knex from 'knex';
import * as Bluebird from 'bluebird';
import { CreateTableBuilder, SchemaBuilder } from 'knex';

import { logger } from '../../logging/logger';
import { ParcelsRepository } from '../../parcels/repositories/parcels.repository';

async function alterDataTypeOfAreaInParcelsTable(knex: Knex): Promise<SchemaBuilder> {
    return Bluebird.resolve()
        .then(() => {
            return knex.schema.alterTable(ParcelsRepository.TABLE_NAME, (table: CreateTableBuilder) => {
                table.float('areaInSquareFeet').notNullable().alter();
            });
        })
        .tap(() => {
            logger.info(`${ParcelsRepository.TABLE_NAME} table altered for change in data type of areaInSquareFeet to float`);
        });
}

async function up(knex: Knex): Promise<boolean> {
    await alterDataTypeOfAreaInParcelsTable(knex);

    return true;
}

async function down(knex: Knex): Promise<boolean> {
    return Promise.resolve(true);
}

module.exports = {
    up: up,
    down: down
};

