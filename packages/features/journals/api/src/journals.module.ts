import { Module } from '@nestjs/common';
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
import { JournalTimeSeriesService, JournalDataPointService, JournalsService } from './services/';
import { JournalsController } from './controllers';
import {
  JOURNALS_MODULE_ID,
  JournalsFeature,
  JournalPermissions,
} from '@lyvely/journals-interface';

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
    JournalTimeSeriesService,
    JournalDataPointDao,
    JournalDataPointService,
  ],
})
export class JournalsModule {}
