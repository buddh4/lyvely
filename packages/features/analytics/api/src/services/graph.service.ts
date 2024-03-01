import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  ContentDataType,
  ContentTypeService,
  FieldValidationException,
  ProtectedProfileContext,
  UpdateQuerySet,
} from '@lyvely/api';
import { Chart, ScoreGraphSeries } from '../schemas';
import {
  ChartType,
  CreateChartModel,
  GRAPH_TYPE_SCORE,
  UpdateChartModel,
  UpdateChartSeriesModel,
} from '@lyvely/analytics-interface';
import { ChartsDao } from '../daos';
import { GraphChartConfig, GraphChartSeries } from '../schemas/graph-chart.schema';
import { IntegrityException } from '@lyvely/interface';
import { isEqual } from 'lodash';

function isGraphChart(chart: Chart): chart is Chart<GraphChartConfig> {
  return chart.config.type === ChartType.Graph;
}

@Injectable()
export class GraphService {
  protected logger = new Logger(GraphService.name);

  @Inject()
  protected chartDao: ChartsDao;

  async addSeries(context: ProtectedProfileContext, chart: Chart, model: UpdateChartSeriesModel) {
    if (!isGraphChart(chart))
      throw new IntegrityException('Attempt to add series to non graph chart');

    let newSeries: GraphChartSeries | undefined;
    if (model.type === GRAPH_TYPE_SCORE) {
      newSeries = new ScoreGraphSeries();
    }

    if (!newSeries)
      throw new IntegrityException('Attempt to add invalid graph series type' + model.type);

    if (chart.config.series.find((series) => isEqual(newSeries, series))) return;

    chart.config.series.push(newSeries);

    await this.chartDao.updateOneByProfileAndId(context.profile, chart, {
      $push: { 'config.series': newSeries },
    });
  }
}
