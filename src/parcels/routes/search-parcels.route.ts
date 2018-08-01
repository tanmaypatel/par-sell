import { Request, ResponseToolkit, RequestQuery } from 'hapi';
import { List } from 'immutable';
import * as Boom from 'boom';

import { Parcel } from '../models/parcel';
import { SearchParcelsCommand } from '../commands/search-parcels.command';
import { ICredentials } from '../../auth/models/credentials';
import { logger } from '../../logging/logger';

module.exports = async (request: Request, h: ResponseToolkit) => {
    const query: any = request.query as any;
    const q: string = query.q ? query.q : '';

    const credentials: ICredentials = request.auth.credentials as ICredentials;

    logger.info(`parcels being searched by user with userId ${credentials.profile.userId} for query ${q}`);

    try {
        const command: SearchParcelsCommand = new SearchParcelsCommand(q);

        return command.execute().then((parcels: List<Parcel>) => {
            return parcels.toJS();
        });
    } catch (error) {
        logger.error(error);

        if (Boom.isBoom(error)) {
            throw error;
        } else {
            throw Boom.internal(`Not able to search parcels for query ${q}`);
        }
    }
};
