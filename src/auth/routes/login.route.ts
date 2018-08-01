import { Request, ResponseToolkit } from 'hapi';
import * as Boom from 'boom';

import { AuthenticationTokenService } from '../services/authentication-token.service';
import { User } from '../models/user';
import { Role } from '../models/role';

module.exports = async (request: Request, h: ResponseToolkit) => {
    if (!request.auth.isAuthenticated) {
        throw Boom.unauthorized(request.auth.error.message);
    }

    const credentials: any = request.auth.credentials as any;
    const profile: User = credentials.profile;
    const role: Role = credentials.role;

    const accessToken: string = AuthenticationTokenService.signJWTToken(profile, role);

    return {
        userId: profile.userId,
        profile: profile.toJS(),
        role: role,
        accessToken: accessToken
    };
};
