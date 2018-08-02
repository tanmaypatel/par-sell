import * as config from 'config';
import { Request, ResponseToolkit } from 'hapi';
import { User } from '../models/user';
import { UsersRepository } from '../repositories/users.repository';
import { ICredentials } from '../models/credentials';

const validate = async (decoded: any, request: Request, h: ResponseToolkit) => {
    const matchedUser: User = await UsersRepository.retrieveById(decoded.userId);

    const credentials: ICredentials = {
        userId: matchedUser.userId,
        profile: matchedUser,
        role: decoded.role
    };

    return {
        credentials: credentials,
        isValid: true
    };
};

const bearerAuthenticationConfiguration = {
    key: config.get('authentication.token.secret'),
    validate: validate,
    verifyOptions: {
        algorithms: ['HS256']
    }
};

export { bearerAuthenticationConfiguration };
