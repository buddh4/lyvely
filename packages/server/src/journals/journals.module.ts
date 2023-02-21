import { Module } from '@nestjs/common';
import { Journal, JournalSchema } from './schemas/journal.schema';
import { UsersModule } from '@/users';
import { ProfilesModule } from '@/profiles';
import { ContentModule, getContentModelDefinition } from '@/content';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JournalDataPoint,
  JournalDataPointSchema,
  JournalNumberDataPoint,
  JournalNumberDataPointSchema,
  JournalTextDataPoint,
  JournalTextDataPointSchema,
} from './schemas/journal-data-point.schema';
import { DataPointValueType } from '@lyvely/common';
import { JournalDataPointDao, JournalNumberDataPointDao, JournalTextDataPointDao } from './daos';
import { JournalNumberDataPointService } from './services/journal-number-data-point.service';
import { JournalTextDataPointService } from './services/journal-text-data-point.service';
import { JournalsDao } from './daos/journals.dao';
import { JournalDataPointService } from './services/journal-data-point.service';
import { JournalsService } from './services/journals.service';

@Module({
  controllers: [],
  imports: [
    UsersModule,
    ProfilesModule,
    ContentModule.registerContentType(Journal),
    MongooseModule.forFeature([
      getContentModelDefinition([{ name: Journal.name, schema: JournalSchema }]),
      {
        name: JournalDataPoint.name,
        schema: JournalDataPointSchema,
        discriminators: [
          {
            name: JournalNumberDataPoint.name,
            schema: JournalNumberDataPointSchema,
            value: DataPointValueType.Number,
          },
          {
            name: JournalTextDataPoint.name,
            schema: JournalTextDataPointSchema,
            value: DataPointValueType.Text,
          },
        ],
      },
    ]),
  ],
  providers: [
    JournalsDao,
    JournalsService,
    JournalDataPointDao,
    JournalDataPointService,
    JournalNumberDataPointDao,
    JournalTextDataPointDao,
    JournalNumberDataPointService,
    JournalTextDataPointService,
  ],
})
export class ActivitiesModule {}
