import { List } from 'immutable';
import { Moment } from 'moment';

import { ParcelsProcessingRepository } from '../repositories/parcels-processing.repository';
import { ParcelProcessing } from '../models/parcel-processing';

export class ReportProcessedParcelsCommand {
    private _parcelName: string;
    private _tractorName: string;
    private _date: Moment;
    private _culture: string;

    constructor(parcelName: string, tractorName: string, date: Moment, culture: string) {
        this._parcelName = parcelName;
        this._tractorName = tractorName;
        this._date = date;
        this._culture = culture;
    }

    execute(): Promise<List<ParcelProcessing>> {
        return ParcelsProcessingRepository.prepareReport(this._parcelName, this._tractorName, this._date, this._culture);
    }
}
