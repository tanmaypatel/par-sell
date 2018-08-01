import { ParcelsRepository } from '../repositories/parcels.repository';

import { Parcel } from '../models/parcel';
import { User } from '../../auth/models/user';

export class CreateParcelCommand {
    private _parcel: Parcel;
    private _createdBy: User;

    constructor(parcel: Parcel, createdBy: User) {
        this._parcel = parcel;
        this._createdBy = createdBy;
    }

    execute(): Promise<Parcel> {
        return ParcelsRepository.create(this._parcel, this._createdBy);
    }
}
