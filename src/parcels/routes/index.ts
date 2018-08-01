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
        }
    },
    handler: require('./search-parcels.route')
});

export default routes;
