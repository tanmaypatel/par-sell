import { Record } from 'immutable';
import { Moment } from 'moment';

export interface ITractor {
    tractorId?: string;
    name: string;
    isActive?: boolean;
    createdBy?: string;
    createdAt?: Moment;
    updatedBy?: string;
    updatedAt?: Moment;
}

// tslint:disable-next-line:variable-name
const TractorRecord = Record({
    tractorId: '',
    name: '',
    isActive: false,
    createdBy: '',
    createdAt: null,
    updatedBy: '',
    updatedAt: null
});

export class Tractor extends TractorRecord implements ITractor {
    tractorId: string;
    name: string;
    isActive: boolean;
    createdBy: string;
    createdAt: Moment;
    updatedBy: string;
    updatedAt: Moment;

    constructor(props: ITractor) {
        super(props);
    }
}
