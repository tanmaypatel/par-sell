import { Request, ResponseToolkit } from 'hapi';
import { List } from 'immutable';
import * as Boom from 'boom';
import * as moment from 'moment';
import { Moment } from 'moment';
import { isUndefined } from 'lodash';

import { ParcelProcessing } from '../models/parcel-processing';
import { ReportProcessedParcelsCommand } from '../commands/report-processed-parcels.command';
import { ICredentials } from '../../auth/models/credentials';
import { logger } from '../../logging/logger';

module.exports = async (request: Request, h: ResponseToolkit) => {
    const query: any = request.query as any;
    const parcelName: string = query.parcelname ? query.parcelname : undefined;
    const tractorName: string = query.tractorname ? query.tractorname : undefined;
    const date: Moment = query.date ? moment.utc(query.date) : undefined;
    const culture: string = query.culture ? query.culture : undefined;

    const credentials: ICredentials = request.auth.credentials as ICredentials;

    logger.info(`Report for Parcels Processing being prepared by user with userId ${credentials.profile.userId} for parcel name ${parcelName}, tractor name ${parcelName}, date ${date} and culture ${culture}`);

    try {

        if(!isUndefined(date) && !date.isValid()) {
            throw Boom.badRequest('Unable to recognize date parameter. It must be in YYYY-MM-DD format.');
        }

        const command: ReportProcessedParcelsCommand = new ReportProcessedParcelsCommand(parcelName, tractorName, date, culture);

        return command.execute().then((parcelProcessings: List<ParcelProcessing>) => {
            return parcelProcessings.toJS();
        });
    } catch (error) {
        logger.error(error);

        if (Boom.isBoom(error)) {
            throw error;
        } else {
            throw Boom.internal(`Unable to prepare Report for Parcels Processing for parcel name ${parcelName}, tractor name ${parcelName}, date ${date} and culture ${culture}`);
        }
    }
};
