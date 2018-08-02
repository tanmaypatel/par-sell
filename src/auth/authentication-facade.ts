import { Server } from 'hapi';

import { basicAuthenticationConfiguration } from './configurations/basic-authentication-configuration';
import { bearerAuthenticationConfiguration } from './configurations/bearer-authentication-configuration';

class AuthenticationFacade {
    async configureAuthenticationStrategies(server: Server): Promise<boolean> {

        await server.register(require('hapi-auth-basic'));
        server.auth.strategy('basic', 'basic', basicAuthenticationConfiguration);

        await server.register(require('hapi-auth-jwt2'));
        server.auth.strategy('bearer', 'jwt', bearerAuthenticationConfiguration);

        return true;
    }
}

const authenticationFacade: AuthenticationFacade = new AuthenticationFacade();

export { authenticationFacade };
