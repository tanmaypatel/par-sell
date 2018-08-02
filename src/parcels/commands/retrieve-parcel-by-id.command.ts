import { ParcelsRepository } from '../repositories/parcels.repository';

import { Parcel } from '../models/parcel';

export class RetrieveParcelByIdCommand {
    private _parcelId: string;

    constructor(parcelId: string) {
        this._parcelId = parcelId;
    }

    execute(): Promise<Parcel> {
        return ParcelsRepository.retrieveById(this._parcelId);
    }
}
