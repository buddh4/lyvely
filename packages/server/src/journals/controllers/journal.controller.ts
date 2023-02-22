import { ProfileRequest } from '@/profiles';
import { ContentTypeController, ContentWritePolicy, ProfileContentRequest } from '@/content';
import {
  DataPointIntervalFilter,
  ENDPOINT_JOURNALS,
  JournalsEndpoint,
  MoveAction,
  SortResponse,
  JournalSearchResponse,
  UpdateDataPointModel,
  UpdateDataPointResponse,
} from '@lyvely/common';
import { UseClassSerializer } from '@/core';
import { JournalsService } from '@/journals/services/journals.service';
import { Body, Get, Inject, Post, Query, Request, ValidationPipe } from '@nestjs/common';
import { Policies } from '@/policies';
import { Journal } from '@/journals/schemas';

@ContentTypeController(ENDPOINT_JOURNALS)
@UseClassSerializer()
export class JournalController implements JournalsEndpoint {
  @Inject()
  protected contentService: JournalsService;

  @Get()
  async getByFilter(
    @Query(new ValidationPipe({ transform: true })) filter: DataPointIntervalFilter,
    @Request() req: ProfileRequest,
  ): Promise<JournalSearchResponse> {
    const { profile, user } = req;
    const { models, dataPoints } = await this.contentService.findByFilter(profile, user, filter);
    return new JournalSearchResponse({
      models: models.map((c) => c.toModel(user)),
      dataPoints: dataPoints.map((value) => value.toModel()),
    });
  }

  @Post(':cid/sort')
  @Policies(ContentWritePolicy)
  async sort(@Body() dto: MoveAction, @Request() req: ProfileContentRequest<Journal>) {
    const { profile, user, content } = req;
    const sort = await this.contentService.sort(
      profile,
      user,
      content,
      dto.interval,
      dto.attachToId,
    );
    return new SortResponse({ sort });
  }

  async updateDataPoint(
    cid: string,
    update: UpdateDataPointModel,
  ): Promise<UpdateDataPointResponse> {}
}
