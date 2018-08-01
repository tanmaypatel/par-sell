import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import * as config from 'config';
import { Server, ServerOptions } from 'hapi';

import { configure } from './app';
import { logger } from './logging/logger';

const SERVER_CONFIGURATION: ServerOptions = {
    host: config.get('host'),
    port: config.get('port'),
    routes: {
        cors: {
            origin: ['*']
        }
    }
};

const server: any = new Server(SERVER_CONFIGURATION);

const initialize = async () => {

    await server.register({
        plugin: require('hapi-pino'),
        options: {
            prettyPrint: process.env.NODE_ENV !== 'production'
        }
    });

    await configure(server);
    return await server.start();
};

initialize()
    .then(() => {
        logger.info(`Server running at: ${server.info.uri}`);
    })
    .catch((error: Error) => {
        logger.error(error.toString());
        throw error;
    });

process.on('unhandledRejection', (reason: Error, promise: Promise<{}>) => {
    logger.error('Unhandled Rejection,');
    logger.error(`Promise: ${promise}`);
    logger.error(`Reason: ${reason}`);

    throw reason;
});

process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception,');
    logger.error(error.message);
});

process.on('warning', (warning: any) => {
    logger.warn('Got following Warning,');
    logger.warn(warning.name);
    logger.warn(warning.message);
    logger.warn(warning.stack);
});

process.on('exit', (code: number) => {
    logger.info(`Application is about to exit with code ${code}`);
});
