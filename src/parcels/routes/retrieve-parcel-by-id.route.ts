import { Request, ResponseToolkit, RequestQuery } from 'hapi';
import * as Boom from 'boom';

import { Parcel } from '../models/parcel';
import { RetrieveParcelByIdCommand } from '../commands/retrieve-parcel-by-id.command';
import { logger } from '../../logging/logger';
import { ICredentials } from '../../auth/models/credentials';

module.exports = async (request: Request, h: ResponseToolkit) => {
    const params: any = request.params as any;
    const parcelId: string = params.parcelId ? params.parcelId : null;

    const credentials: ICredentials = request.auth.credentials as ICredentials;

    logger.info(`parcel with id ${parcelId} name being retrieved by user with userId ${credentials.profile.userId}`);

    try {
        const command: RetrieveParcelByIdCommand = new RetrieveParcelByIdCommand(parcelId);

        return command.execute().then((parcel: Parcel) => {
            return parcel.toJS();
        });
    } catch (error) {
        logger.error(error);

        if (Boom.isBoom(error)) {
            throw error;
        } else {
            throw Boom.internal(`unable to retrieve parcel with id ${parcelId}`);
        }
    }
};
