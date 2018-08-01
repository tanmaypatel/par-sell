import { ServerRoute } from 'hapi';
import * as Joi from 'joi';

const routes: ServerRoute[] = [];

routes.push({
    method: 'POST',
    path: '/tractors',
    options: {
        auth: {
            mode: 'required',
            strategies: ['bearer']
        }
    },
    handler: require('./create-tractor.route')
});

routes.push({
    method: 'GET',
    path: '/tractors',
    options: {
        auth: {
            mode: 'required',
            strategies: ['bearer']
        }
    },
    handler: require('./retrieve-tractors.route')
});

routes.push({
    method: 'GET',
    path: '/tractors/{tractorId}',
    options: {
        auth: {
            mode: 'required',
            strategies: ['bearer']
        }
    },
    handler: require('./retrieve-tractor-by-id.route')
});

routes.push({
    method: 'GET',
    path: '/tractors/search',
    options: {
        auth: {
            mode: 'required',
            strategies: ['bearer']
        }
    },
    handler: require('./search-tractor.route')
});

export default routes;
