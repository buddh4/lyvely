import { ProfileRequest ,
  AbstractContentTypeController,
  ContentTypeController,
  ContentWritePolicy,
  ProfileContentRequest,
  ProtectedProfileContentRequest,
, UseClassSerializer , Policies } from '@lyvely/core';
import { CalendarPlanFilter, CalendarPlanSort } from '@lyvely/calendar-plan';
import {
  ENDPOINT_JOURNALS,
  JournalsEndpoint,
  JournalSearchResponse,
  UpdateJournalResponse,
  UpdateJournalModel,
  CreateJournalModel,
} from '@lyvely/journals-interface';
import {
  UpdateDataPointModel,
  UpdateDataPointResponse,
  DataPointModelConverter,
} from '@lyvely/time-series';
import { SortResponse } from '@lyvely/common';
import { JournalTimeSeriesService, JournalDataPointService, JournalsService } from '../services';
import { Body, Get, Inject, Post, Query, Request, ValidationPipe } from '@nestjs/common';
import { Journal } from '../schemas';

@ContentTypeController(ENDPOINT_JOURNALS, Journal)
@UseClassSerializer()
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
    @Request() req: ProfileRequest,
  ): Promise<JournalSearchResponse> {
    const { profile, user } = req;
    const { models, dataPoints } = await this.timeSeriesService.findTimeSeries(
      profile,
      user,
      filter,
    );
    return new JournalSearchResponse({
      models: models.map((c) => c.toModel(user)),
      dataPoints: dataPoints.map((value) => DataPointModelConverter.toModel(value)),
    });
  }

  @Post(':cid/sort')
  @Policies(ContentWritePolicy)
  async sort(
    @Body() dto: CalendarPlanSort,
    @Request() req: ProtectedProfileContentRequest<Journal>,
  ): Promise<SortResponse> {
    const { profile, user, content } = req;
    const sort = await this.timeSeriesService.sort(
      profile,
      user,
      content,
      dto.interval,
      dto.attachToId,
    );
    return new SortResponse({ sort });
  }

  @Post(':cid/update-data-point')
  @Policies(ContentWritePolicy)
  async updateDataPoint(
    @Body() dto: UpdateDataPointModel,
    @Request() req: ProtectedProfileContentRequest<Journal>,
  ): Promise<UpdateDataPointResponse> {
    const { profile, user, content } = req;

    const { dataPoint } = await this.dataPointService.upsertDataPoint(
      profile,
      user,
      content,
      dto.date,
      dto.value,
    );

    return new UpdateDataPointResponse({
      model: content.toModel(),
      dataPoint: DataPointModelConverter.toModel(dataPoint),
    });
  }
}
