import { TractorsRepository } from '../repositories/tractors.repository';

import { Tractor } from '../models/tractor';
import { User } from '../../auth/models/user';

export class CreateTractorCommand {
    private _tractor: Tractor;
    private _createdBy: User;

    constructor(tractor: Tractor, createdBy: User) {
        this._tractor = tractor;
        this._createdBy = createdBy;
    }

    execute(): Promise<Tractor> {
        return TractorsRepository.create(this._tractor, this._createdBy);
    }
}
