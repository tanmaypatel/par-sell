import { ParcelsRepository } from '../repositories/parcels.repository';

import { Parcel } from '../models/parcel';
import { List } from 'immutable';

export class RetrieveParcelsCommand {
    private _pageStart: number;
    private _pageSize: number;

    constructor(pageStart?: number, pageSize?: number) {
        this._pageStart = pageStart;
        this._pageSize = pageSize;
    }

    execute(): Promise<List<Parcel>> {
        return ParcelsRepository.retrievePage(this._pageStart, this._pageSize);
    }
}
