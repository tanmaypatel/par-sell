import { ServerRoute } from 'hapi';
import * as Joi from 'joi';

const routes: ServerRoute[] = [];

/**
 * Routes for Parcel Entiry
 */

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

/**
 * Routes for Parcel Processing Entiry
 */

routes.push({
    method: 'POST',
    path: '/parcels/process',
    options: {
        auth: {
            mode: 'required',
            strategies: ['bearer']
        },
        validate: {
            payload: Joi.object().keys({
                parcelId: Joi.string().uuid().required(),
                tractorId: Joi.string().uuid().required(),
                date: Joi.date().required(),
                occupiedAreaInSquareFeet: Joi.number().min(0).required()
            })
        }
    },
    handler: require('./process-parcel.route')
});

routes.push({
    method: 'GET',
    path: '/parcels/processed',
    options: {
        auth: {
            mode: 'required',
            strategies: ['bearer']
        },
        validate: {
            query: {
                parcelname: Joi.string().min(2),
                tractorname: Joi.string().min(2),
                date: Joi.date(),
                culture: Joi.string().min(2),
                pagesize: Joi.number().max(1000)
            }
        }
    },
    handler: require('./report-processed-parcels.route')
});


routes.push({
    method: 'GET',
    path: '/parcels/processed/all',
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
    handler: require('./retrieve-parcel-processings.route')
});


export default routes;
