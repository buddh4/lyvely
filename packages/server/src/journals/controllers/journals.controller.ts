import { ProfileRequest } from '@/profiles';
import {
  AbstractContentTypeController,
  ContentTypeController,
  ContentWritePolicy,
  ProfileContentRequest,
} from '@/content';
import {
  CalendarPlanFilter,
  ENDPOINT_JOURNALS,
  JournalsEndpoint,
  CalendarPlanSort,
  SortResponse,
  JournalSearchResponse,
  UpdateDataPointModel,
  UpdateDataPointResponse,
  CreateJournalModel,
  UpdateJournalResponse,
  UpdateHabitModel,
  UpdateJournalModel,
} from '@lyvely/common';
import { UseClassSerializer } from '@/core';
import { JournalTimeSeriesService } from '@/journals/services/journal-time-series.service';
import { Body, Get, Inject, Post, Query, Request, ValidationPipe } from '@nestjs/common';
import { Policies } from '@/policies';
import { Journal } from '@/journals/schemas';
import { JournalDataPointService } from '@/journals/services/journal-data-point.service';
import { JournalsService } from '@/journals/services/journals.service';
import { DataPointModelConverter } from '@/time-series';

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
    @Request() req: ProfileContentRequest<Journal>,
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
    @Request() req: ProfileContentRequest<Journal>,
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
