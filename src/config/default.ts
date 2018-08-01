const config: any = {
    host: '0.0.0.0',
    port: process.env.PORT || 8669,
    authentication: {
        token: {
            secret: '__SUPER_SECRET____SUPER_SECRET__',
            issuer: 'par-sell-api__default',
            audience: 'par-sell-api-consumer__default'
        }
    }
};

module.exports = config;