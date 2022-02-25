/* import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Journal,
  JournalDocument,
  JournalLog,
  JournalLogDocument,
} from './schemas/journal.schema';
import { Model } from 'mongoose';
import { ProfilesService } from '../profiles/services/profiles.service';
import { TimeableContentLogService } from '../calendar/timeable/services/timeable-content-log.service';
import { TimeableContentLogConstructor } from '../calendar/timeable/schemas/timeable-content.schema';

interface JournalLogUpdate {
  value: number;
  text: string;
}


@Injectable()
export class JournalLogsService extends TimeableContentLogService<JournalLogDocument, JournalLog, Journal> {
  @InjectModel(Journal.name)
  protected JournalModel: Model<JournalDocument>;

  @InjectModel(JournalLog.name)
  protected LogModel: Model<JournalLogDocument>;

  @Inject()
  protected profileService: ProfilesService;

  getLogModelConstructor(): TimeableContentLogConstructor<Journal> {
    return JournalLog;
  }

  async updateLogValue(profile, log, model: Journal, update: JournalLogUpdate): Promise<JournalLogDocument> {
    return this.LogModel.findOneAndUpdate(
      { _id: log._id },
      {
        $set: {
          value: Math.min(update.value, model.rating.max),
          text: update.text,
        },
      },
      { new: true },
    );
  }
}
*/