import { Request, ResponseToolkit, RequestQuery } from 'hapi';
import { List } from 'immutable';
import * as Boom from 'boom';

import { ParcelProcessing } from '../models/parcel-processing';
import { RetrieveParcelProcessingsCommand } from '../commands/retrieve-parcel-processings.command';
import { ICredentials } from '../../auth/models/credentials';
import { logger } from '../../logging/logger';

module.exports = async (request: Request, h: ResponseToolkit) => {
    const query: any = request.query as any;
    const pageStart: number = query.pagestart ? parseInt(query.pagestart, 10) : 0;
    const pageSize: number = query.pagesize ? parseInt(query.pagesize, 10) : 0;

    const credentials: ICredentials = request.auth.credentials as ICredentials;

    logger.info(`Parcel Processings being retrieved by user with userId ${credentials.profile.userId} for page starting from ${pageStart} with size ${pageSize}`);

    try {
        const command: RetrieveParcelProcessingsCommand = new RetrieveParcelProcessingsCommand(pageStart, pageSize);

        return command.execute().then((parcelProcessings: List<ParcelProcessing>) => {
            return parcelProcessings.toJS();
        });
    } catch (error) {
        logger.error(error);

        if (Boom.isBoom(error)) {
            throw error;
        } else {
            throw Boom.internal(`Unable to retrieve processing of Parcels for page starting from ${pageStart} with size ${pageSize}`);
        }
    }
};
