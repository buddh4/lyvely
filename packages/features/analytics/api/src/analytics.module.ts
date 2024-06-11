import {
  ContentModule,
  getContentModelDefinition,
  LyvelyModule,
  ProfilesModule,
} from '@lyvely/api';
import {
  ANALYTICS_MODULE_ID,
  AnalyticsFeature,
  ChartPermissions,
} from '@lyvely/analytics-interface';
import { ChartSeriesService, ChartsService, ProfileScoreAggregationService } from './services';
import { ChartsController } from './controllers';
import { Chart, ChartSchema } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { ChartsDao } from './daos';
import { AnalyticsEvents } from './analytics.events';

@LyvelyModule({
  id: ANALYTICS_MODULE_ID,
  path: __dirname,
  features: [AnalyticsFeature],
  permissions: ChartPermissions,
  imports: [
    ProfilesModule,
    ContentModule.registerContentType(Chart),
    MongooseModule.forFeature([
      getContentModelDefinition([{ name: Chart.name, schema: ChartSchema }]),
    ]),
  ],
  controllers: [ChartsController],
  providers: [
    AnalyticsEvents,
    ChartsService,
    ProfileScoreAggregationService,
    ChartSeriesService,
    ChartsDao,
  ],
})
export class AnalyticsModule {}
