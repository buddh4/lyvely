import { Delete, Get, Put, Inject, Post, Request, Body, Param } from '@nestjs/common';
import {
  AbstractContentTypeController,
  ContentTypeController,
  ProfileContentRequest,
  ProfileRequest,
  ProtectedProfileContentRequest,
  UseClassSerializer,
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
} from '@lyvely/analytics-interface';
import { Chart } from '../schemas';
import { ChartSeriesDataResponse } from '@lyvely/analytics-interface/src';

@ContentTypeController(API_ANALYTICS_CHARTS, Chart)
@UseClassSerializer()
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
    const { profile, user } = req;
    const charts = (await this.contentService.findAllByProfile(profile, { archived: false })).map(
      (document) => document.toModel(user),
    );

    return new ChartListModel({ charts });
  }

  @Post(ChartsEndpointPaths.ADD_SERIES(':cid'))
  async addSeries(
    @Body() model: UpdateChartSeriesModel,
    @Request() request: ProtectedProfileContentRequest<Chart>,
  ): Promise<ChartModel> {
    const { content, context } = request;

    await this.chartSeriesService.addSeriesByUpdateModel(context, content, model);

    return content.toModel();
  }

  @Put(ChartsEndpointPaths.UPDATE_SERIES(':cid', ':sid'))
  async updateSeries(
    @Param('sid') sid,
    @Body() model: UpdateChartSeriesModel,
    @Request() request: ProfileContentRequest<Chart>,
  ): Promise<ChartModel> {
    const { content } = request;

    return content.toModel();
  }

  @Delete(ChartsEndpointPaths.DELETE_SERIES(':cid', ':sid'))
  async deleteSeries(
    @Param('sid') sid,
    @Request() request: ProfileContentRequest<Chart>,
  ): Promise<ChartModel> {
    const { content } = request;

    return content.toModel();
  }

  @Get(ChartsEndpointPaths.SERIES_DATA(':cid'))
  async getSeriesData(
    @Request() request: ProfileContentRequest<Chart>,
  ): Promise<ChartSeriesDataResponse> {
    const { content } = request;
    return new ChartSeriesDataResponse();
  }
}