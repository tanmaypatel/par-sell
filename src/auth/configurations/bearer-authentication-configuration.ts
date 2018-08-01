import * as config from 'config';
import { Request, ResponseToolkit } from 'hapi';
import { User } from '../models/user';
import { UsersRepository } from '../repositories/users.repository';

const validate = async (decoded: any, request: Request, h: ResponseToolkit) => {

    const matchedUser: User = await UsersRepository.retrieveById(decoded.userId);

    return {
        isValid: true,
        credentials: {
            userId: decoded.userId,
            profile: matchedUser,
            role: decoded.role
        }
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
