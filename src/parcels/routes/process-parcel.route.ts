import { Request, ResponseToolkit } from 'hapi';
import * as moment from 'moment';
import { extend } from 'lodash';
import * as Boom from 'boom';

import { ICredentials } from '../../auth/models/credentials';
import { logger } from '../../logging/logger';
import { IParcelProcessing, ParcelProcessing } from '../models/parcel-processing';
import { ProcessParcelCommand } from '../commands/process-parcel.command';
import { Parcel } from '../models/parcel';
import { ParcelsRepository } from '../repositories/parcels.repository';
import { Tractor } from '../../tractors/models/tractor';
import { TractorsRepository } from '../../tractors/repositories/tractors.repository';

module.exports = async (request: Request, h: ResponseToolkit) => {
    const parcelProcessingData: IParcelProcessing = extend(request.payload, {
        date: moment.utc((request.payload as any).date)
    }) as IParcelProcessing;

    const credentials: ICredentials = request.auth.credentials as ICredentials;

    logger.info(`Parcel with parcelId ${parcelProcessingData.parcelId} being processed by user with userId ${credentials.profile.userId} for tractor with tractorId ${parcelProcessingData.tractorId}`);

    try {
        /**
         * Request Data Validation and Population
         */

        if(parcelProcessingData.date.isBefore(moment.utc().startOf('day'))) {
            throw Boom.badRequest(`Date for processing must be today or in future`);
        }

        const matchingParcel: Parcel = await ParcelsRepository.retrieveById(parcelProcessingData.parcelId);

        if (!matchingParcel) {
            throw Boom.badRequest(`Parcel for parcelId ${parcelProcessingData.parcelId} not found`);
        }

        if (parcelProcessingData.occupiedAreaInSquareFeet < matchingParcel.areaInSquareFeet) {
            throw Boom.badRequest(`Area for Processing must be larger than Parcel area`);
        }

        const matchingTractor: Tractor = await TractorsRepository.retrieveById(parcelProcessingData.tractorId);

        if (!matchingTractor) {
            throw Boom.badRequest(`Tractor for tractorId ${parcelProcessingData.tractorId} not found`);
        }

        /**
         * Request Valdation Successful. Proceed with command execution for the route.
         */

        const parcelProcessing: ParcelProcessing = new ParcelProcessing(extend(parcelProcessingData, {
            parcel: matchingParcel,
            tractor: matchingTractor
        }));

        const command: ProcessParcelCommand = new ProcessParcelCommand(parcelProcessing, credentials.profile);

        return command.execute().then((processedParcel: ParcelProcessing) => {
            return processedParcel.toJS();
        });
    } catch (error) {
        logger.error(error);

        if (Boom.isBoom(error)) {
            throw error;
        } else {
            throw Boom.internal(`Unable to process Parcel with parcelId ${parcelProcessingData.parcelId} for tractor with tractorId ${parcelProcessingData.tractorId}`);
        }
    }
};
