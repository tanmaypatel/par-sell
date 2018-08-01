import { Server } from 'hapi';

import { authenticationFacade } from './auth/authentication-facade';
import { default as authenticationRoutes } from './auth/routes';

const configure = async (server: Server): Promise<any> => {

    /*****************************/
    /* Setup Un-protected Routes */
    /*****************************/
    server.route({
        method: 'GET',
        path: '/',
        handler: (request: {}, h: {}) => {
            return {
                message: 'hello from par-sell!',
                timestamp: new Date().getTime()
            };
        }
    });

    /************************/
    /* Setup Authentication */
    /************************/

    await authenticationFacade.configureAuthenticationStrategies(server);

    server.route(authenticationRoutes);

    /**************************/
    /* Setup Protected Routes */
    /**************************/
};

export { configure };
