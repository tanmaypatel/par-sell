import { TractorsRepository } from '../repositories/tractors.repository';

import { Tractor } from '../models/tractor';
import { List } from 'immutable';

export class RetrieveTractorsCommand {
    private _pageStart: number;
    private _pageSize: number;

    constructor(pageStart?: number, pageSize?: number) {
        this._pageStart = pageStart;
        this._pageSize = pageSize;
    }

    execute(): Promise<List<Tractor>> {
        return TractorsRepository.retrievePage(this._pageStart, this._pageSize);
    }
}
