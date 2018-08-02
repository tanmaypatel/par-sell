import { Record } from 'immutable';
import { Moment } from 'moment';
import { Role } from './role';

export interface IUserRole {
    userId: string;
    role: Role;
    createdAt?: Moment;
    updatedAt?: Moment;
}

// tslint:disable-next-line:variable-name
const UserRoleRecord = Record({
    userId: '',
    role: '',
    createdAt: null,
    updatedAt: null
});

export class UserRole extends UserRoleRecord implements IUserRole {
    userId: string;
    role: Role;
    createdAt: Moment;
    updatedAt: Moment;

    constructor(props: IUserRole) {
        super(props);
    }
}
