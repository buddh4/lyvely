import {
  ProfileRequest,
  AbstractContentTypeController,
  ContentTypeController,
  ContentWritePolicy,
  ProtectedProfileContentRequest,
  Policies,
  SortResponse,
  ValidBody,
} from '@lyvely/api';
import { CalendarPlanFilter, CalendarPlanSort } from '@lyvely/calendar-plan';
import {
  ENDPOINT_JOURNALS,
  JournalsEndpoint,
  JournalSearchResponse,
  UpdateJournalResponse,
  UpdateJournalModel,
  CreateJournalModel,
  JournalsEndpoints,
} from '@lyvely/journals-interface';
import {
  UpdateDataPointModel,
  UpdateDataPointResponse,
  DataPointModelConverter,
} from '@lyvely/time-series';
import { JournalTimeSeriesService, JournalDataPointService, JournalsService } from '../services';
import { Get, Inject, Post, Query, Request, ValidationPipe } from '@nestjs/common';
import { Journal } from '../schemas';

@ContentTypeController(ENDPOINT_JOURNALS, Journal)
export class JournalsController
  extends AbstractContentTypeController<Journal, CreateJournalModel, UpdateJournalModel>
  implements JournalsEndpoint
{
  @Inject()
  protected contentService: JournalsService;

  @Inject()
  protected timeSeriesService: JournalTimeSeriesService;

  @Inject()
  protected dataPointService: JournalDataPointService;

  protected createModelType = CreateJournalModel;
  protected updateModelType = UpdateJournalModel;
  protected updateResponseType = UpdateJournalResponse;

  @Get()
  async getByFilter(
    @Query(new ValidationPipe({ transform: true })) filter: CalendarPlanFilter,
    @Request() req: ProfileRequest
  ): Promise<JournalSearchResponse> {
    const { context, user } = req;
    const { models, dataPoints } = await this.timeSeriesService.findTimeSeries(context, filter);
    return new JournalSearchResponse({
      models: models.map((c) => c.toModel(user)),
      dataPoints: dataPoints.map((value) => DataPointModelConverter.toModel(value)),
    });
  }

  @Post(JournalsEndpoints.SORT(':cid'))
  @Policies(ContentWritePolicy)
  async sort(
    @ValidBody() dto: CalendarPlanSort,
    @Request() req: ProtectedProfileContentRequest<Journal>
  ): Promise<SortResponse> {
    const { context } = req;
    const sort = await this.timeSeriesService.sort(context, dto.interval, dto.attachToId);
    return new SortResponse({ sort });
  }

  @Post(JournalsEndpoints.UPDATE_DATA_POINT(':cid'))
  @Policies(ContentWritePolicy)
  async updateDataPoint(
    @ValidBody() dto: UpdateDataPointModel,
    @Request() req: ProtectedProfileContentRequest<Journal>
  ): Promise<UpdateDataPointResponse> {
    const { context, content } = req;

    const { dataPoint } = await this.dataPointService.upsertDataPoint(
      context,
      content,
      dto.date,
      dto.value
    );

    return new UpdateDataPointResponse({
      model: content.toModel(),
      dataPoint: DataPointModelConverter.toModel(dataPoint),
    });
  }
}
