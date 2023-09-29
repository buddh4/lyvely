import { Module } from '@nestjs/common';
import { UsersModule } from '@lyvely/users';
import { ProfilesModule } from '@lyvely/profiles';
import { ContentModule, getContentModelDefinition } from '@lyvely/content';
import { MongooseModule } from '@nestjs/mongoose';
import { Journal, JournalSchema } from './schemas';
import { DataPointValueType, getDataPointModelDefinition } from '@lyvely/time-series';
import { JournalDataPointDao, JournalsDao } from './daos';
import { JournalTimeSeriesService, JournalDataPointService, JournalsService } from './services/';
import { JournalsController } from './controllers';

@Module({
  controllers: [JournalsController],
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
