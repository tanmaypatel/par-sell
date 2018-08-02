import { Record } from 'immutable';
import { Moment } from 'moment';
import { Tractor } from '../../tractors/models/tractor';

export interface IParcelForProcessing {
    processingId?: string;
    parcelId: string;
    parcel?: ParcelProcessing;
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
    processingId: '',
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

export class ParcelProcessing extends ParcelForProcessingRecord implements IParcelForProcessing {
    processingId: string;
    parcelId: string;
    parcel: ParcelProcessing;
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
