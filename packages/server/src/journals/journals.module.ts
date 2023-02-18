import { Module } from '@nestjs/common';
import { Journal, JournalSchema } from '@/journals/schemas/journal.schema';
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
} from '@/journals/schemas/journal-data-point.schema';
import { DataPointValueType } from '@lyvely/common';
import {
  JournalDataPointDao,
  JournalNumberDataPointDao,
  JournalTextDataPointDao,
} from '@/journals/daos';
import { JournalNumberDataPointService } from '@/journals/services/journal-number-data-point.service';
import { JournalTextDataPointService } from '@/journals/services/journal-text-data-point.service';

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
    JournalDataPointDao,
    JournalNumberDataPointDao,
    JournalTextDataPointDao,
    JournalNumberDataPointService,
    JournalTextDataPointService,
  ],
})
export class ActivitiesModule {}
