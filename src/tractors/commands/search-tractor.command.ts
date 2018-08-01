import { TractorsRepository } from '../repositories/tractors.repository';

import { Tractor } from '../models/tractor';
import { List } from 'immutable';

export class SearchTractorsCommand {
    private _query: string;

    constructor(query: string) {
        this._query = query;
    }

    execute(): Promise<List<Tractor>> {
        return TractorsRepository.search(this._query);
    }
}
