import { ServerRoute } from 'hapi';

const routes: ServerRoute[] = [];

routes.push({
    method: 'POST',
    path: '/auth/login',
    options: {
        auth: {
            mode: 'required',
            strategies: ['basic']
        }
    },
    handler: require('./login.route')
});

routes.push({
    method: 'GET',
    path: '/auth/validate',
    options: {
        auth: {
            mode: 'required',
            strategies: ['bearer']
        }
    },
    handler: require('./validate-token.route')
});

export default routes;
