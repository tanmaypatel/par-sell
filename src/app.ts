import { Server } from 'hapi';

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
};

export { configure };
