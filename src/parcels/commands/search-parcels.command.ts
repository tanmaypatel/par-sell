import { ParcelsRepository } from '../repositories/parcels.repository';

import { Parcel } from '../models/parcel';
import { List } from 'immutable';

export class SearchParcelsCommand {
    private _query: string;

    constructor(query: string) {
        this._query = query;
    }

    execute(): Promise<List<Parcel>> {
        return ParcelsRepository.search(this._query);
    }
}
