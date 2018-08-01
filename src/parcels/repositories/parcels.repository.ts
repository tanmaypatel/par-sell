import { omit, extend, map } from 'lodash';
import * as moment from 'moment';
import { Transaction, QueryBuilder } from 'knex';
import * as uuid from 'uuid/v4';

import { logger } from '../../logging/logger';
import { default as knex } from '../../repository/knex';
import { Parcel } from '../models/parcel';
import { List } from 'immutable';
import { User } from '../../auth/models/user';

export class ParcelsRepository {
    static get TABLE_NAME(): string {
        return 'parcels';
    }

    static get DEFAULT_PAGE_SIZE(): number {
        return 10;
    }

    static async create(parcel: Parcel, createdBy: User, tx: Transaction = null): Promise<Parcel> {
        try {
            if (parcel.parcelId) {
                throw new Error('Parcel already has a parcelId');
            }

            parcel = parcel.merge({
                parcelId: uuid(),
                createdBy: createdBy.userId,
                createdAt: moment.utc(),
                updatedBy: createdBy.userId,
                updatedAt: moment.utc()
            }) as Parcel;

            const serializedData: any = ParcelsRepository._serialize(parcel);

            let queryBuilder: QueryBuilder = knex.insert(serializedData).into(ParcelsRepository.TABLE_NAME);

            if (tx) {
                queryBuilder = queryBuilder.transacting(tx);
            }

            await queryBuilder;
            return parcel;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    static async retrieveById(parcelId: string): Promise<Parcel> {
        const parcels: Parcel[] = await ParcelsRepository._retrieveByIds([parcelId]);
        return parcels.length ? parcels[0] : null;
    }

    static async search(query: string): Promise<List<Parcel>> {
        const queryBuilder: QueryBuilder = knex
            .select('*')
            .from(ParcelsRepository.TABLE_NAME)
            .where(knex.raw('lower("name") like ?', `%${query.toLowerCase()}%`))
            .orWhere(knex.raw('lower("culture") like ?', `%${query.toLowerCase()}%`))
            .orderBy('name', 'desc')
            .limit(this.DEFAULT_PAGE_SIZE);

        const rows: any[] = await queryBuilder;
        let parcels: Parcel[] = [];

        if (rows.length) {
            parcels = map(rows, (currentRow: any) => {
                return ParcelsRepository._deserialize(currentRow);
            });
        }

        return List(parcels);
    }

    static async retrievePage(pageStart?: number, pageSize?: number): Promise<List<Parcel>> {
        if (!pageStart) {
            pageStart = 0;
        }

        if (!pageSize) {
            pageSize = ParcelsRepository.DEFAULT_PAGE_SIZE;
        }

        const queryBuilder: QueryBuilder = knex
            .select('*')
            .from(ParcelsRepository.TABLE_NAME)
            .orderBy('updatedAt', 'desc')
            .offset(pageStart)
            .limit(pageSize);

        const rows: any[] = await queryBuilder;
        let parcels: Parcel[] = [];

        if (rows.length) {
            parcels = map(rows, (currentRow: any) => {
                return ParcelsRepository._deserialize(currentRow);
            });
        }

        return List(parcels);
    }

    static _deserialize(parcelData: any): Parcel {
        return new Parcel(
            extend(parcelData, {
                areaInSquareFeet: parseFloat(parcelData.areaInSquareFeet),
                createdAt: moment.utc(parcelData.createdAt),
                updatedAt: moment.utc(parcelData.updatedAt)
            })
        );
    }

    private static _serialize(parcel: Parcel): any {
        const serializedData: any = parcel.toJS();

        extend(serializedData, {
            createdBy: serializedData.createdBy ? serializedData.createdBy : null,
            createdAt: serializedData.createdAt ? serializedData.createdAt.toDate() : null,
            updatedBy: serializedData.updatedBy ? serializedData.updatedBy : null,
            updatedAt: serializedData.updatedAt ? serializedData.updatedAt.toDate() : null
        });

        return serializedData;
    }

    private static async _retrieveByIds(parcelIds: string[]): Promise<Parcel[]> {
        const queryBuilder: QueryBuilder = knex
            .select('*')
            .from(ParcelsRepository.TABLE_NAME)
            .whereIn('parcelId', parcelIds);

        const rows: any[] = await queryBuilder;
        let parcels: Parcel[] = [];

        if (rows.length) {
            parcels = map(rows, (currentRow: any) => {
                return ParcelsRepository._deserialize(currentRow);
            });
        }

        return parcels;
    }
}
