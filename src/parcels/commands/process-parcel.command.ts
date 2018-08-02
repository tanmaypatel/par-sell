import { ParcelsProcessingRepository } from '../repositories/parcels-processing.repository';

import { User } from '../../auth/models/user';
import { ParcelProcessing } from '../models/parcel-processing';

export class ProcessParcelCommand {
    private _parcelProcessing: ParcelProcessing;
    private _createdBy: User;

    constructor(parcelProcessing: ParcelProcessing, createdBy: User) {
        this._parcelProcessing = parcelProcessing;
        this._createdBy = createdBy;
    }

    execute(): Promise<ParcelProcessing> {
        return ParcelsProcessingRepository.create(this._parcelProcessing, this._createdBy);
    }
}
