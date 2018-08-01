import { TractorsRepository } from '../repositories/tractors.repository';

import { Tractor } from '../models/tractor';
import { List } from 'immutable';

export class RetrieveTractorByIdCommand {
    private _tractorId: string;

    constructor(tractorId: string) {
        this._tractorId = tractorId;
    }

    execute(): Promise<Tractor> {
        return TractorsRepository.retrieveById(this._tractorId);
    }
}
