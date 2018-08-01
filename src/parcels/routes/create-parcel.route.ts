import { Request, ResponseToolkit } from 'hapi';
import * as Boom from 'boom';

import { Parcel, IParcel } from '../models/parcel';
import { CreateParcelCommand } from '../commands/create-parcel.command';
import { ICredentials } from '../../auth/models/credentials';
import { logger } from '../../logging/logger';

module.exports = async (request: Request, h: ResponseToolkit) => {
    const parcelData: IParcel = request.payload as IParcel;

    const credentials: ICredentials = request.auth.credentials as ICredentials;

    logger.info(`new parcel with name being created by user with userId ${credentials.profile.userId}`);

    try {
        const parcel: Parcel = new Parcel(parcelData);

        const command: CreateParcelCommand = new CreateParcelCommand(parcel, credentials.profile);

        return command.execute().then((createdParcel: Parcel) => {
            return createdParcel.toJS();
        });
    } catch (error) {
        logger.error(error);

        if (Boom.isBoom(error)) {
            throw error;
        } else {
            throw Boom.internal(`unable to create new parcel with name ${parcelData.name}`);
        }
    }
};
