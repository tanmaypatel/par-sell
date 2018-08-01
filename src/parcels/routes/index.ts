import { ServerRoute } from 'hapi';
import * as Joi from 'joi';

const routes: ServerRoute[] = [];

routes.push({
    method: 'POST',
    path: '/parcels',
    options: {
        auth: {
            mode: 'required',
            strategies: ['bearer']
        },
        validate: {
            payload: Joi.object().keys({
                name: Joi.string().trim().min(3).max(256).required(),
                culture: Joi.string().trim().min(1).max(256).required(),
                areaInSquareFeet: Joi.number().min(0).required()
            })
        }
    },
    handler: require('./create-parcel.route')
});

routes.push({
    method: 'GET',
    path: '/parcels',
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
    handler: require('./retrieve-parcels.route')
});

routes.push({
    method: 'GET',
    path: '/parcels/{parcelId}',
    options: {
        auth: {
            mode: 'required',
            strategies: ['bearer']
        },
        validate: {
            params: {
                parcelId: Joi.string().trim().uuid().required()
            }
        }
    },
    handler: require('./retrieve-parcel-by-id.route')
});

routes.push({
    method: 'GET',
    path: '/parcels/search',
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
    handler: require('./search-parcels.route')
});

export default routes;
