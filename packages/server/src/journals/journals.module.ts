import { Module } from '@nestjs/common';
import { UsersModule } from '@/users';
import { ProfilesModule } from '@/profiles';
import { ContentModule, getContentModelDefinition } from '@/content';
import { MongooseModule } from '@nestjs/mongoose';
import { Journal, JournalSchema } from './schemas';
import { DataPointValueType } from '@lyvely/common';
import { JournalDataPointDao, JournalsDao } from './daos';
import { JournalTimeSeriesService, JournalDataPointService } from './services/';
import { JournalsController } from './controllers';
import { JournalsService } from '@/journals/services/journals.service';
import {
  DataPoint,
  DataPointSchema,
  NumberDataPoint,
  NumberDataPointSchema,
  TextDataPoint,
  TextDataPointSchema,
} from '@/time-series';
import {
  SelectionDataPoint,
  SelectionDataPointSchema,
} from '@/time-series/data-points/schemas/selection-data-point.schema';

@Module({
  controllers: [JournalsController],
  imports: [
    UsersModule,
    ProfilesModule,
    ContentModule.registerContentType(Journal),
    MongooseModule.forFeature([
      getContentModelDefinition([{ name: Journal.name, schema: JournalSchema }]),
      {
        name: DataPoint.name,
        schema: DataPointSchema,
        collection: 'journaldatapoints',
        discriminators: [
          {
            name: NumberDataPoint.name,
            schema: NumberDataPointSchema,
            value: DataPointValueType.Number,
          },
          {
            name: TextDataPoint.name,
            schema: TextDataPointSchema,
            value: DataPointValueType.Text,
          },
          {
            name: SelectionDataPoint.name,
            schema: SelectionDataPointSchema,
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
