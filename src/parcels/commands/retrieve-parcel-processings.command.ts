import { ParcelsProcessingRepository } from '../repositories/parcels-processing.repository';

import { ParcelProcessing } from '../models/parcel-processing';
import { List } from 'immutable';

export class RetrieveParcelProcessingsCommand {
    private _pageStart: number;
    private _pageSize: number;

    constructor(pageStart?: number, pageSize?: number) {
        this._pageStart = pageStart;
        this._pageSize = pageSize;
    }

    execute(): Promise<List<ParcelProcessing>> {
        return ParcelsProcessingRepository.retrievePage(this._pageStart, this._pageSize);
    }
}
