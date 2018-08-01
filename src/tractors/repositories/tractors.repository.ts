import { omit, extend, map } from 'lodash';
import * as moment from 'moment';
import { Transaction, QueryBuilder } from 'knex';
import * as uuid from 'uuid/v4';

import { logger } from '../../logging/logger';
import { default as knex } from '../../repository/knex';
import { Tractor } from '../models/tractor';
import { List } from 'immutable';
import { User } from '../../auth/models/user';

export class TractorsRepository {
    static get TABLE_NAME(): string {
        return 'tractors';
    }

    static get DEFAULT_PAGE_SIZE(): number {
        return 10;
    }

    static async create(tractor: Tractor, createdBy: User, tx: Transaction = null): Promise<Tractor> {
        try {
            if (tractor.tractorId) {
                throw new Error('Tractor already has a tractorId');
            }

            tractor = tractor.merge({
                tractorId: uuid(),
                isActive: true,
                createdBy: createdBy.userId,
                createdAt: moment.utc(),
                updatedBy: createdBy.userId,
                updatedAt: moment.utc()
            }) as Tractor;

            const serializedData: any = TractorsRepository._serialize(tractor);

            let queryBuilder: QueryBuilder = knex.insert(serializedData).into(TractorsRepository.TABLE_NAME);

            if (tx) {
                queryBuilder = queryBuilder.transacting(tx);
            }

            await queryBuilder;
            return tractor;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    static async retrieveById(tractorId: string): Promise<Tractor> {
        const tractors: Tractor[] = await TractorsRepository._retrieveByIds([tractorId]);
        return tractors.length ? tractors[0] : null;
    }

    static async retrieveByName(name: string): Promise<Tractor> {
        const tractors: Tractor[] = await TractorsRepository._retrieveByNames([name]);
        return tractors.length ? tractors[0] : null;
    }

    static async search(query: string): Promise<List<Tractor>> {
        const queryBuilder: QueryBuilder = knex
            .select('*')
            .from(TractorsRepository.TABLE_NAME)
            .where(knex.raw('lower("name") like ?', `%${query.toLowerCase()}%`))
            .andWhere({
                isActive: true
            })
            .orderBy('name', 'desc')
            .limit(this.DEFAULT_PAGE_SIZE);

        const rows: any[] = await queryBuilder;
        let tractors: Tractor[] = [];

        if (rows.length) {
            tractors = map(rows, (currentRow: any) => {
                return TractorsRepository._deserialize(currentRow);
            });
        }

        return List(tractors);
    }

    static async retrievePage(pageStart?: number, pageSize?: number): Promise<List<Tractor>> {
        if (!pageStart) {
            pageStart = 0;
        }

        if (!pageSize) {
            pageSize = TractorsRepository.DEFAULT_PAGE_SIZE;
        }

        const queryBuilder: QueryBuilder = knex
            .select('*')
            .from(TractorsRepository.TABLE_NAME)
            .where({
                isActive: true
            })
            .orderBy('updatedAt', 'desc')
            .offset(pageStart)
            .limit(pageSize);

        const rows: any[] = await queryBuilder;
        let tractors: Tractor[] = [];

        if (rows.length) {
            tractors = map(rows, (currentRow: any) => {
                return TractorsRepository._deserialize(currentRow);
            });
        }

        return List(tractors);
    }

    static _deserialize(tractorData: any): Tractor {
        return new Tractor(
            extend(tractorData, {
                isActive: tractorData.isActive ? true : false,
                createdAt: moment.utc(tractorData.createdAt),
                updatedAt: moment.utc(tractorData.updatedAt)
            })
        );
    }

    private static _serialize(tractor: Tractor): any {
        const serializedData: any = tractor.toJS();

        extend(serializedData, {
            createdBy: serializedData.createdBy ? serializedData.createdBy : null,
            createdAt: serializedData.createdAt ? serializedData.createdAt.toDate() : null,
            updatedBy: serializedData.updatedBy ? serializedData.updatedBy : null,
            updatedAt: serializedData.updatedAt ? serializedData.updatedAt.toDate() : null
        });

        return serializedData;
    }

    private static async _retrieveByIds(tractorIds: string[]): Promise<Tractor[]> {
        const queryBuilder: QueryBuilder = knex
            .select('*')
            .from(TractorsRepository.TABLE_NAME)
            .whereIn('tractorId', tractorIds);

        const rows: any[] = await queryBuilder;
        let tractors: Tractor[] = [];

        if (rows.length) {
            tractors = map(rows, (currentRow: any) => {
                return TractorsRepository._deserialize(currentRow);
            });
        }

        return tractors;
    }

    private static async _retrieveByNames(names: string[]): Promise<Tractor[]> {
        const queryBuilder: QueryBuilder = knex
            .select('*')
            .from(TractorsRepository.TABLE_NAME)
            .whereIn('name', names);

        const rows: any[] = await queryBuilder;
        let tractors: Tractor[] = [];

        if (rows.length) {
            tractors = map(rows, (currentRow: any) => {
                return TractorsRepository._deserialize(currentRow);
            });
        }

        return tractors;
    }
}
