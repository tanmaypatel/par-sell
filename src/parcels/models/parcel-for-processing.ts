import { Record } from 'immutable';
import { Moment } from 'moment';
import { Tractor } from '../../tractors/models/tractor';

export interface IParcelForProcessing {
    parcelId: string;
    parcel?: ParcelForProcessing;
    tractorId: string;
    tractor?: Tractor;
    date: Moment;
    occupiedArea: number;
    createdBy?: string;
    createdAt?: Moment;
    updatedBy?: string;
    updatedAt?: Moment;
}

// tslint:disable-next-line:variable-name
const ParcelForProcessingRecord = Record({
    parcelId: '',
    parcel: null,
    tractorId: '',
    tractor: null,
    date: null,
    occupiedAreaInSquareFeet: 0,
    createdBy: '',
    createdAt: null,
    updatedBy: '',
    updatedAt: null
});

export class ParcelForProcessing extends ParcelForProcessingRecord implements IParcelForProcessing {
    parcelId: string;
    parcel: ParcelForProcessing;
    tractorId: string;
    tractor: Tractor;
    date: Moment;
    occupiedArea: number;
    createdBy: string;
    createdAt: Moment;
    updatedBy: string;
    updatedAt: Moment;

    constructor(props: IParcelForProcessing) {
        super(props);
    }
}
