import * as Knex from 'knex';
import * as Bluebird from 'bluebird';
import { CreateTableBuilder, SchemaBuilder } from 'knex';

import { logger } from '../../logging/logger';
import { UsersRepository } from '../../auth/repositories/users.repository';
import { UserRolesRepository } from '../../auth/repositories/user-roles.repository';

async function createUsersTable(knex: Knex): Promise<SchemaBuilder> {
    return Bluebird.resolve()
        .then(() => {
            return knex.schema.createTableIfNotExists(UsersRepository.TABLE_NAME, (table: CreateTableBuilder) => {
                table.uuid('userId').notNullable().primary();
                table.string('email').notNullable().unique();
                table.string('password').notNullable();
                table.boolean('isActive').notNullable();
                table.string('firstName').notNullable();
                table.string('lastName').notNullable();
                table.timestamp('createdAt').notNullable();
                table.timestamp('updatedAt').notNullable();
            });
        })
        .tap(() => {
            logger.info(`${UsersRepository.TABLE_NAME} table created`);
        });
}

async function createUserRolesTable(knex: Knex): Promise<SchemaBuilder> {
    return Bluebird.resolve()
        .then(() => {
            return knex.schema.createTableIfNotExists(UserRolesRepository.TABLE_NAME, (table: CreateTableBuilder) => {
                table.uuid('userId').references('userId').inTable(UsersRepository.TABLE_NAME).notNullable().primary();
                table.string('role').notNullable();
                table.timestamp('createdAt').notNullable();
                table.timestamp('updatedAt').notNullable();
            });
        })
        .tap(() => {
            logger.info(`${UsersRepository.TABLE_NAME} table created`);
        });
}

async function up(knex: Knex): Promise<boolean> {
    await createUsersTable(knex);
    await createUserRolesTable(knex);

    return true;
}

async function down(knex: Knex): Promise<boolean> {
    return Promise.resolve(true);
}

module.exports = {
    up: up,
    down: down
};

