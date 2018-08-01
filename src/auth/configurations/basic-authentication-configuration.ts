import * as config from 'config';

import { Role } from '../models/role';

const validate = async (request: any, username: string, password: string, h: any) => {
    if (username === 'dummy' && password === 'dummy') {
        const credentials: any = {
            userId: 'dummy',
            profile: {},
            role: Role.USER
        };

        return {
            credentials: credentials,
            isValid: true
        };
    } else {
        return {
            credentials: null,
            isValid: false
        };
    }
};

const basicAuthenticationConfiguration: any = {
    validate: validate
};

export { basicAuthenticationConfiguration };
