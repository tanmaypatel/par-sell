import * as config from 'config';
import { Request, ResponseToolkit } from 'hapi';

const validate = async (decoded: any, request: Request, h: ResponseToolkit) => {
    return {
        isValid: true,
        credentials: {
            userId: decoded.userId,
            profile: {},
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
