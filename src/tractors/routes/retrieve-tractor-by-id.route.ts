import { Request, ResponseToolkit, RequestQuery } from 'hapi';
import * as Boom from 'boom';

import { Tractor } from '../models/tractor';
import { RetrieveTractorByIdCommand } from '../commands/retrieve-tractor-by-id.command';
import { logger } from '../../logging/logger';
import { ICredentials } from '../../auth/models/credentials';

module.exports = async (request: Request, h: ResponseToolkit) => {
    const params: any = request.params as any;
    const tractorId: string = params.tractorId ? params.tractorId : null;

    const credentials: ICredentials = request.auth.credentials as ICredentials;

    logger.info(`tractor with id ${tractorId} name being retrieved by user with userId ${credentials.profile.userId}`);

    try {
        const command: RetrieveTractorByIdCommand = new RetrieveTractorByIdCommand(tractorId);

        return command.execute().then((tractor: Tractor) => {
            return tractor.toJS();
        });
    } catch (error) {
        logger.error(error);

        if (Boom.isBoom(error)) {
            throw error;
        } else {
            throw Boom.internal(`unable to retrieve tractor with id ${tractorId}`);
        }
    }
};
