import { Module } from '@nestjs/common';
import { UsersModule } from '@/users';
import { ProfilesModule } from '@/profiles';
import { ContentModule, getContentModelDefinition } from '@/content';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Journal,
  JournalSchema,
  JournalDataPoint,
  JournalDataPointSchema,
  JournalNumberDataPoint,
  JournalNumberDataPointSchema,
  JournalSelectionDataPoint,
  JournalSelectionDataPointSchema,
} from './schemas';
import { DataPointValueType } from '@lyvely/common';
import { JournalDataPointDao, JournalsDao } from './daos';
import { JournalTimeSeriesService, JournalDataPointService } from './services/';
import { JournalsController } from './controllers';
import { JournalsService } from '@/journals/services/journals.service';
import { TextDataPoint, TextDataPointSchema } from '@/time-series';

@Module({
  controllers: [JournalsController],
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
            name: TextDataPoint.name,
            schema: TextDataPointSchema,
            value: DataPointValueType.Text,
          },
          {
            name: JournalSelectionDataPoint.name,
            schema: JournalSelectionDataPointSchema,
            value: DataPointValueType.Selection,
          },
        ],
      },
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
