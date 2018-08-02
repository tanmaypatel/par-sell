import { extend, map, omit } from 'lodash';
import * as moment from 'moment';
import { Transaction, QueryBuilder, Raw } from 'knex';
import * as uuid from 'uuid/v4';

import { logger } from '../../logging/logger';
import { default as knex } from '../../repository/knex';
import { List } from 'immutable';
import { User } from '../../auth/models/user';
import { ParcelProcessing } from '../models/parcel-processing';
import { Parcel } from '../models/parcel';
import { Tractor } from '../../tractors/models/tractor';
import { ParcelsRepository } from './parcels.repository';
import { TractorsRepository } from '../../tractors/repositories/tractors.repository';

export class ParcelsProcessingRepository {
    static get TABLE_NAME(): string {
        return 'parcels_processing';
    }

    static get DEFAULT_PAGE_SIZE(): number {
        return 10;
    }

    static async create(parcelProcessing: ParcelProcessing, createdBy: User, tx: Transaction = null): Promise<ParcelProcessing> {
        try {
            if (parcelProcessing.processingId) {
                throw new Error('Parcel Processing already has a processingId');
            }

            parcelProcessing = parcelProcessing.merge({
                processingId: uuid(),
                createdBy: createdBy.userId,
                createdAt: moment.utc(),
                updatedBy: createdBy.userId,
                updatedAt: moment.utc()
            }) as ParcelProcessing;

            const serializedData: any = ParcelsProcessingRepository._serialize(parcelProcessing);

            let queryBuilder: QueryBuilder = knex.insert(serializedData).into(ParcelsProcessingRepository.TABLE_NAME);

            if (tx) {
                queryBuilder = queryBuilder.transacting(tx);
            }

            await queryBuilder;
            return parcelProcessing;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    static async retrieveByProcessingId(processingId: string): Promise<ParcelProcessing> {
        const parcelProcessings: List<ParcelProcessing> = await ParcelsProcessingRepository._retrieveByProcessingIds([processingId]);
        return parcelProcessings.size ? parcelProcessings.get(0) : null;
    }

    static async retrieveByParcelId(parcelId: string): Promise<ParcelProcessing> {
        const parcelProcessings: List<ParcelProcessing> = await ParcelsProcessingRepository._retrieveByParcelIds([parcelId]);
        return parcelProcessings.size ? parcelProcessings.get(0) : null;
    }

    static async retrieveByTractorId(tractorId: string): Promise<ParcelProcessing> {
        const parcelProcessings: List<ParcelProcessing> = await ParcelsProcessingRepository._retrieveByTractorIds([tractorId]);
        return parcelProcessings.size ? parcelProcessings.get(0) : null;
    }

    static async retrievePage(pageStart?: number, pageSize?: number): Promise<List<ParcelProcessing>> {
        if (!pageStart) {
            pageStart = 0;
        }

        if (!pageSize) {
            pageSize = ParcelsProcessingRepository.DEFAULT_PAGE_SIZE;
        }

        const queryBuilder: QueryBuilder = knex
            .select('*')
            .from(ParcelsProcessingRepository.TABLE_NAME)
            .orderBy('updatedAt', 'desc')
            .offset(pageStart)
            .limit(pageSize);

        const rows: any[] = await queryBuilder;
        let parcelProcessings: ParcelProcessing[] = [];

        if (rows.length) {
            parcelProcessings = map(rows, (currentRow: any) => {
                return ParcelsProcessingRepository._deserialize(currentRow);
            });
        }

        return await ParcelsProcessingRepository._enhanceChildren(List(parcelProcessings));
    }

    static async prepareReport(parcelName: string = '', tractorName: string = '', date: moment.Moment = null, culture: string = ''): Promise<List<ParcelProcessing>> {
        let queryBuilder: QueryBuilder = knex
            .select('*')
            .from(ParcelsProcessingRepository.TABLE_NAME)
            .leftJoin(ParcelsRepository.TABLE_NAME, `${ParcelsRepository.TABLE_NAME}.parcelId`, `${ParcelsProcessingRepository.TABLE_NAME}.parcelId`)
            .leftJoin(TractorsRepository.TABLE_NAME, `${TractorsRepository.TABLE_NAME}.tractorId`, `${ParcelsProcessingRepository.TABLE_NAME}.tractorId`);

        let hasAPreviousCondition: boolean = false;
        if (parcelName.length) {
            const condition: Raw = knex.raw(`lower(${ParcelsRepository.TABLE_NAME}.name) like ?`, `%${parcelName.toLowerCase()}%`);

            if (hasAPreviousCondition) {
                queryBuilder = queryBuilder.andWhere(condition);
            } else {
                queryBuilder = queryBuilder.where(condition);
            }

            hasAPreviousCondition = true;
        }

        if (tractorName.length) {
            const condition: Raw = knex.raw(`lower(${TractorsRepository.TABLE_NAME}.name) like ?`, `%${tractorName.toLowerCase()}%`);

            if (hasAPreviousCondition) {
                queryBuilder = queryBuilder.andWhere(condition);
            } else {
                queryBuilder = queryBuilder.where(condition);
            }

            hasAPreviousCondition = true;
        }

        if (date) {
            const condition: Raw = knex.raw(`${ParcelsProcessingRepository.TABLE_NAME}.date = ?`, date.format('YYYY-MM-DD'));

            if (hasAPreviousCondition) {
                queryBuilder = queryBuilder.andWhere(condition);
            } else {
                queryBuilder = queryBuilder.where(condition);
            }

            hasAPreviousCondition = true;
        }

        if (culture) {
            const condition: Raw = knex.raw(`lower(${ParcelsRepository.TABLE_NAME}.culture) like ?`, `%${culture}%`);

            if (hasAPreviousCondition) {
                queryBuilder = queryBuilder.andWhere(condition);
            } else {
                queryBuilder = queryBuilder.where(condition);
            }

            hasAPreviousCondition = true;
        }

        const rows: any[] = await queryBuilder;
        let parcelProcessings: ParcelProcessing[] = [];

        if (rows.length) {
            parcelProcessings = map(rows, (currentRow: any) => {
                return ParcelsProcessingRepository._deserialize(currentRow);
            });
        }

        return await ParcelsProcessingRepository._enhanceChildren(List(parcelProcessings));
    }

    private static async _enhanceChildren(partialParcelProcessings: List<ParcelProcessing>): Promise<List<ParcelProcessing>> {
        const parcelIds: string[] = partialParcelProcessings
            .map((datum: ParcelProcessing) => {
                return datum.parcelId;
            })
            .toArray();

        const tractorIds: string[] = partialParcelProcessings
            .map((datum: ParcelProcessing) => {
                return datum.tractorId;
            })
            .toArray();

        const parcels: List<Parcel> = await ParcelsRepository.retrieveByIds(parcelIds);
        const tractors: List<Tractor> = await TractorsRepository.retrieveByIds(tractorIds);

        const parcelsById: { [key: string]: Parcel } = {};
        parcels.forEach((datum: Parcel) => {
            parcelsById[datum.parcelId] = datum;
        });

        const tractorsById: { [key: string]: Tractor } = {};
        tractors.forEach((datum: Tractor) => {
            tractorsById[datum.tractorId] = datum;
        });

        return partialParcelProcessings
            .map((datum: ParcelProcessing) => {
                return datum.merge({
                    parcel: parcelsById[datum.parcelId],
                    tractor: tractorsById[datum.tractorId]
                }) as ParcelProcessing;
            })
            .toList();
    }

    private static _deserialize(parcelProcessingData: any): ParcelProcessing {
        return new ParcelProcessing(
            extend(parcelProcessingData, {
                areaInSquareFeet: parseFloat(parcelProcessingData.areaInSquareFeet),
                createdAt: moment.utc(parcelProcessingData.createdAt),
                updatedAt: moment.utc(parcelProcessingData.updatedAt)
            })
        );
    }

    private static _serialize(parcelProcessing: ParcelProcessing): any {
        const serializedData: any = omit(parcelProcessing.toJS(), 'parcel', 'tractor');

        extend(serializedData, {
            date: parcelProcessing.date.format('YYYY-MM-DD'),
            createdBy: serializedData.createdBy ? serializedData.createdBy : null,
            createdAt: serializedData.createdAt ? serializedData.createdAt.toDate() : null,
            updatedBy: serializedData.updatedBy ? serializedData.updatedBy : null,
            updatedAt: serializedData.updatedAt ? serializedData.updatedAt.toDate() : null
        });

        return serializedData;
    }

    private static async _retrieveByProcessingIds(processingIds: string[]): Promise<List<ParcelProcessing>> {
        const queryBuilder: QueryBuilder = knex
            .select('*')
            .from(ParcelsProcessingRepository.TABLE_NAME)
            .whereIn('processingId', processingIds);

        const rows: any[] = await queryBuilder;
        let parcelProcessings: ParcelProcessing[] = [];

        if (rows.length) {
            parcelProcessings = map(rows, (currentRow: any) => {
                return ParcelsProcessingRepository._deserialize(currentRow);
            });
        }

        return ParcelsProcessingRepository._enhanceChildren(List(parcelProcessings));
    }

    private static async _retrieveByParcelIds(parcelIds: string[]): Promise<List<ParcelProcessing>> {
        const queryBuilder: QueryBuilder = knex
            .select('*')
            .from(ParcelsProcessingRepository.TABLE_NAME)
            .whereIn('parcelId', parcelIds);

        const rows: any[] = await queryBuilder;
        let parcelProcessings: ParcelProcessing[] = [];

        if (rows.length) {
            parcelProcessings = map(rows, (currentRow: any) => {
                return ParcelsProcessingRepository._deserialize(currentRow);
            });
        }

        return ParcelsProcessingRepository._enhanceChildren(List(parcelProcessings));
    }

    private static async _retrieveByTractorIds(tractorIds: string[]): Promise<List<ParcelProcessing>> {
        const queryBuilder: QueryBuilder = knex
            .select('*')
            .from(ParcelsProcessingRepository.TABLE_NAME)
            .whereIn('tractorId', tractorIds);

        const rows: any[] = await queryBuilder;
        let parcelProcessings: ParcelProcessing[] = [];

        if (rows.length) {
            parcelProcessings = map(rows, (currentRow: any) => {
                return ParcelsProcessingRepository._deserialize(currentRow);
            });
        }

        return ParcelsProcessingRepository._enhanceChildren(List(parcelProcessings));
    }
}
