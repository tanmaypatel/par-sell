import { Request, ResponseToolkit, RequestQuery } from 'hapi';
import { List } from 'immutable';
import * as Boom from 'boom';

import { Tractor } from '../models/tractor';
import { SearchTractorsCommand } from '../commands/search-tractors.command';
import { ICredentials } from '../../auth/models/credentials';
import { logger } from '../../logging/logger';

module.exports = async (request: Request, h: ResponseToolkit) => {
    const query: any = request.query as any;
    const q: string = query.q ? query.q : '';

    const credentials: ICredentials = request.auth.credentials as ICredentials;

    logger.info(`tractors being searched by user with userId ${credentials.profile.userId} for query ${q}`);

    try {
        const command: SearchTractorsCommand = new SearchTractorsCommand(q);

        return command.execute().then((tractors: List<Tractor>) => {
            return tractors.toJS();
        });
    } catch (error) {
        logger.error(error);

        if (Boom.isBoom(error)) {
            throw error;
        } else {
            throw Boom.internal(`Not able to search tractors for query ${q}`);
        }
    }
};
