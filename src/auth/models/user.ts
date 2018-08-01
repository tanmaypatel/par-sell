import { Record } from 'immutable';
import { Moment } from 'moment';

export interface IUser {
    userId?: string;
    email: string;
    isActive?: boolean;
    firstName: string;
    lastName: string;
    createdAt?: Moment;
    updatedAt?: Moment;
}

// tslint:disable-next-line:variable-name
const UserRecord = Record({
    userId: '',
    email: '',
    isActive: false,
    firstName: '',
    lastName: '',
    createdAt: null,
    updatedAt: null
});

export class User extends UserRecord implements IUser {
    userId: string;
    email: string;
    isActive: boolean;
    firstName: string;
    lastName: string;
    createdAt: Moment;
    updatedAt: Moment;

    constructor(props: IUser) {
        super(props);
    }
}
