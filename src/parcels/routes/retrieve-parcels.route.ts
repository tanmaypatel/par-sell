import { Request, ResponseToolkit } from 'hapi';
import { List } from 'immutable';
import * as Boom from 'boom';

import { Parcel } from '../models/parcel';
import { RetrieveParcelsCommand } from '../commands/retrieve-parcels.command';
import { ICredentials } from '../../auth/models/credentials';
import { logger } from '../../logging/logger';

module.exports = async (request: Request, h: ResponseToolkit) => {
    const query: any = request.query as any;
    const pageStart: number = query.pagestart ? parseInt(query.pagestart, 10) : 0;
    const pageSize: number = query.pagesize ? parseInt(query.pagesize, 10) : 0;

    const credentials: ICredentials = request.auth.credentials as ICredentials;

    logger.info(`parcels being retrieved by user with userId ${credentials.profile.userId} for page starting from ${pageStart} with size ${pageSize}`);

    try {
        const command: RetrieveParcelsCommand = new RetrieveParcelsCommand(pageStart, pageSize);

        return command.execute().then((parcels: List<Parcel>) => {
            return parcels.toJS();
        });
    } catch (error) {
        logger.error(error);

        if (Boom.isBoom(error)) {
            throw error;
        } else {
            throw Boom.internal(`Unable to retrieve parcels for page starting from ${pageStart} with size ${pageSize}`);
        }
    }
};
