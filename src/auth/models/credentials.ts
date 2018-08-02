import { User } from './user';
import { Role } from './role';

export interface ICredentials {
    userId: string;
    profile: User;
    role: Role;
}
