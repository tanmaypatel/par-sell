import * as config from 'config';
import * as jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { Role } from '../models/role';

export class AuthenticationTokenService {
    static signJWTToken(user: User, role: Role): string {
        return jwt.sign(
            {
                userId: user.userId,
                role: role
            },
            config.get('authentication.token.secret'),
            {
                algorithm: 'HS256',
                expiresIn: '1h',
                issuer: config.get('authentication.token.issuer'),
                audience: config.get('authentication.token.audience')
            }
        );
    }
}
