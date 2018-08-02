const config: any = {
    host: '0.0.0.0',
    port: process.env.PORT || 8669,
    authentication: {
        token: {
            secret: '__SUPER_SECRET____SUPER_SECRET__',
            issuer: 'par-sell-api__default',
            audience: 'par-sell-api-consumer__default'
        }
    },
    repository: {
        sqlite: {
            filename: './dist/default.db' // needs to be changed for migration
        },
        postgres: {
            host: 'localhost',
            port: 5432,
            database: 'parsell',
            user: 'postgres',
            password: 'postgres'
        }
    }
};

module.exports = config;