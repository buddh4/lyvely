import {
  LyvelyModule,
  UsersModule,
  ProfilesModule,
  ContentModule,
  getContentModelDefinition,
} from '@lyvely/api';
import { MongooseModule } from '@nestjs/mongoose';
import { Journal, JournalSchema } from './schemas';
import { DataPointValueType, getDataPointModelDefinition } from '@lyvely/time-series';
import { JournalDataPointDao, JournalsDao } from './daos';
import {
  JournalTimeSeriesService,
  JournalDataPointService,
  JournalsService,
  JournalValueAggregationService,
} from './services';
import { JournalsController } from './controllers';
import {
  JOURNALS_MODULE_ID,
  JournalsFeature,
  JournalPermissions,
} from '@lyvely/journals-interface';
import { JournalsEvents } from './journals.events';

@LyvelyModule({
  id: JOURNALS_MODULE_ID,
  name: 'Journals',
  path: __dirname,
  features: [JournalsFeature],
  controllers: [JournalsController],
  permissions: JournalPermissions,
  imports: [
    UsersModule,
    ProfilesModule,
    ContentModule.registerContentType(Journal),
    MongooseModule.forFeature([
      getContentModelDefinition([{ name: Journal.name, schema: JournalSchema }]),
      getDataPointModelDefinition(Journal.name, [
        DataPointValueType.Number,
        DataPointValueType.Text,
        DataPointValueType.Selection,
        DataPointValueType.Timer,
      ]),
    ]),
  ],
  providers: [
    JournalsDao,
    JournalsService,
    JournalsEvents,
    JournalTimeSeriesService,
    JournalValueAggregationService,
    JournalDataPointDao,
    JournalDataPointService,
  ],
})
export class JournalsModule {}
