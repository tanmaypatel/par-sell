import { Record } from 'immutable';
import { Moment } from 'moment';

export interface IParcel {
    parcelId?: string;
    name: string;
    culture: string;
    areaInSquareFeet: number;
    isProcessed?: boolean;
    createdBy?: string;
    createdAt?: Moment;
    updatedBy?: string;
    updatedAt?: Moment;
}

// tslint:disable-next-line:variable-name
const ParcelRecord = Record({
    parcelId: '',
    name: '',
    culture: '',
    areaInSquareFeet: 0,
    isProcessed: false,
    createdBy: '',
    createdAt: null,
    updatedBy: '',
    updatedAt: null
});

export class Parcel extends ParcelRecord implements IParcel {
    parcelId: string;
    name: string;
    culture: string;
    areaInSquareFeet: number;
    isProcessed: boolean;
    createdBy: string;
    createdAt: Moment;
    updatedBy: string;
    updatedAt: Moment;

    constructor(props: IParcel) {
        super(props);
    }
}
