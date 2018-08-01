import { Request, ResponseToolkit } from 'hapi';
import * as Boom from 'boom';

import { Tractor, ITractor } from '../models/tractor';
import { CreateTractorCommand } from '../commands/create-tractor.command';
import { ICredentials } from '../../auth/models/credentials';
import { logger } from '../../logging/logger';

module.exports = async (request: Request, h: ResponseToolkit) => {
    const tractorData: ITractor = request.payload as ITractor;

    const credentials: ICredentials = request.auth.credentials as ICredentials;

    logger.info(`new tractor with name being created by user with userId ${credentials.profile.userId}`);

    try {
        const tractor: Tractor = new Tractor(tractorData);

        const command: CreateTractorCommand = new CreateTractorCommand(tractor, credentials.profile);

        return command.execute().then((createdTractor: Tractor) => {
            return createdTractor.toJS();
        });
    } catch (error) {
        logger.error(error);

        if (Boom.isBoom(error)) {
            throw error;
        } else {
            throw Boom.internal(`unable to create new tractor with name ${tractorData.name}`);
        }
    }
};
