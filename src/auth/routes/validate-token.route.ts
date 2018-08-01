import { Request, ResponseToolkit } from 'hapi';
import * as Boom from 'boom';

import { User } from '../models/user';
import { Role } from '../models/role';

module.exports = async (request: Request, h: ResponseToolkit) => {
    if (!request.auth.isAuthenticated) {
        throw Boom.unauthorized(request.auth.error.message);
    }

    const credentials: any = request.auth.credentials as any;
    const profile: User = credentials.profile;
    const role: Role = credentials.role;

    return {
        userId: profile.userId,
        profile: profile.toJS(),
        role: role
    };
};
