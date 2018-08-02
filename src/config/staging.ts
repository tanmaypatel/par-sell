const stagingConfig: any = {
    authentication: {
        token: {
            secret: '__SUPER_SECRET____SUPER_SECRET__',
            issuer: 'par-sell-api__staging',
            audience: 'par-sell-api-consumer__staging'
        }
    },
    repository: {
        postgres: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        }
    }
};

module.exports = stagingConfig;