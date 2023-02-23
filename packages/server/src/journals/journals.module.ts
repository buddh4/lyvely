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
  JournalTextDataPoint,
  JournalTextDataPointSchema,
} from './schemas';
import { DataPointValueType } from '@lyvely/common';
import { JournalDataPointDao, JournalsDao } from './daos';
import { JournalsService, JournalDataPointService } from './services/';
import { JournalsController } from './controllers';

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
            name: JournalTextDataPoint.name,
            schema: JournalTextDataPointSchema,
            value: DataPointValueType.Text,
          },
        ],
      },
    ]),
  ],
  providers: [JournalsDao, JournalsService, JournalDataPointDao, JournalDataPointService],
})
export class JournalsModule {}
