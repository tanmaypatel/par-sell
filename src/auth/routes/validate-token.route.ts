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
    const profile: any = credentials.profile;
    const role: Role = credentials.role;

    const user: User = new User({
        userId: credentials.userId,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        isActive: profile.isActive
    });

    const accessToken: string = AuthenticationTokenService.signJWTToken(user, role);

    return {
        profile: user.toJS(),
        role: role
    };
};
