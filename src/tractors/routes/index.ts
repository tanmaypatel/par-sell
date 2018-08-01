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
        },
        validate: {
            payload: Joi.object().keys({
                name: Joi.string().trim().min(3).max(256).required()
            })
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
        },
        validate: {
            query: {
                pagestart: Joi.number().min(0),
                pagesize: Joi.number().max(1000)
            }
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
        },
        validate: {
            params: {
                tractorId: Joi.string().trim().uuid().required()
            }
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
        },
        validate: {
            query: {
                q: Joi.string().trim().min(3).required()
            }
        }
    },
    handler: require('./search-tractors.route')
});

export default routes;
