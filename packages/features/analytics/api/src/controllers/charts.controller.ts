import { Delete, Get, Put, Inject, Post, Request, Param, Query } from '@nestjs/common';
import {
  AbstractContentTypeController,
  ContentTypeController,
  ContentWritePolicy,
  type ISortRequest,
  Policies,
  ProfileContentRequest,
  ProfileRequest,
  ProtectedProfileContentRequest,
  sortBySortOrder,
  SortResponse,
  UseClassSerializer,
  ValidBody,
} from '@lyvely/api';
import { ChartsService, ChartSeriesService } from '../services';
import {
  ChartEndpoint,
  CreateChartModel,
  UpdateChartModel,
  UpdateChartResponseModel,
  API_ANALYTICS_CHARTS,
  ChartListModel,
  ChartModel,
  ChartsEndpointPaths,
  UpdateChartSeriesModel,
  ChartSeriesDataResponse,
} from '@lyvely/analytics-interface';
import { Chart } from '../schemas';

@ContentTypeController(API_ANALYTICS_CHARTS, Chart)
export class ChartsController
  extends AbstractContentTypeController<Chart, CreateChartModel, UpdateChartModel>
  implements ChartEndpoint
{
  @Inject()
  protected contentService: ChartsService;

  @Inject()
  protected chartSeriesService: ChartSeriesService;

  protected createModelType = CreateChartModel;

  protected updateResponseType = UpdateChartResponseModel;

  protected updateModelType = UpdateChartModel;

  @Get()
  async getCharts(@Request() req: ProfileRequest): Promise<ChartListModel> {
    const { context, user } = req;
    const charts = (await this.contentService.findAllByContext(context, { archived: false }))
      .map((document) => document.toModel(user))
      .sort(sortBySortOrder);

    return new ChartListModel({ charts });
  }

  @Policies(ContentWritePolicy)
  @Post(ChartsEndpointPaths.ADD_SERIES(':cid'))
  async addSeries(
    @ValidBody() model: UpdateChartSeriesModel,
    @Request() request: ProtectedProfileContentRequest<Chart>
  ): Promise<ChartModel> {
    const { content, context } = request;

    await this.chartSeriesService.addSeries(context, content, model.config);

    return content.toModel();
  }

  @Policies(ContentWritePolicy)
  @Put(ChartsEndpointPaths.UPDATE_SERIES(':cid', ':sid'))
  async updateSeries(
    @Param('sid') sid,
    @ValidBody() model: UpdateChartSeriesModel,
    @Request() request: ProtectedProfileContentRequest<Chart>
  ): Promise<ChartModel> {
    const { context, content } = request;

    await this.chartSeriesService.updateSeries(context, content, sid, model.config);

    return content.toModel();
  }

  @Policies(ContentWritePolicy)
  @Delete(ChartsEndpointPaths.DELETE_SERIES(':cid', ':sid'))
  async deleteSeries(
    @Param('sid') sid,
    @Request() request: ProtectedProfileContentRequest<Chart>
  ): Promise<ChartModel> {
    const { context, content } = request;

    await this.chartSeriesService.deleteSeries(context, content, sid);

    return content.toModel();
  }

  @Get(ChartsEndpointPaths.SERIES_DATA(':cid'))
  async getSeriesData(
    @Query() query: Record<string, string>,
    @Request() request: ProfileContentRequest<Chart>
  ): Promise<ChartSeriesDataResponse> {
    const { context, content } = request;
    const result = await this.chartSeriesService.getSeriesData(context, content, query);
    return new ChartSeriesDataResponse(result);
  }

  @Post(ChartsEndpointPaths.SORT(':cid'))
  @Policies(ContentWritePolicy)
  async sort(
    @ValidBody() dto: ISortRequest,
    @Request() req: ProtectedProfileContentRequest<Chart>
  ) {
    const { context, content } = req;
    const sort = await this.chartSeriesService.sort(context, content, dto.attachToId);
    return new SortResponse({ sort });
  }
}
