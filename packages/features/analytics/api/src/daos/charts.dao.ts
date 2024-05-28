import {
  assureObjectId,
  assureStringId,
  ContentTypeDao,
  type DocumentIdentity,
  Model,
} from '@lyvely/api';
import { Chart, ChartSeriesConfig } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { ANALYTICS_MODULE_ID, IChartSeriesConfig } from '@lyvely/analytics-interface';
import { Injectable } from '@nestjs/common';
import { findAndReplace } from '@lyvely/common';

@Injectable()
export class ChartsDao extends ContentTypeDao<Chart> {
  @InjectModel(Chart.name)
  protected model: Model<Chart>;

  async updateSeries(
    chart: DocumentIdentity<Chart>,
    sid: DocumentIdentity<ChartSeriesConfig>,
    config: IChartSeriesConfig
  ) {
    sid = assureObjectId(sid);
    const update = { ...config, _id: sid, id: assureStringId(sid) };

    const result = await this.updateOneByFilter(
      chart,
      { $set: { 'config.series.$[elem]': update } },
      {},
      { arrayFilters: [{ 'elem._id': sid }] }
    );

    if (result && chart instanceof Chart) {
      findAndReplace(chart.config.series, update, 'id');
    }

    return result;
  }

  async deleteSeries(chart: DocumentIdentity<Chart>, sid: DocumentIdentity<ChartSeriesConfig>) {
    sid = assureObjectId(sid);
    const result = await this.updateOneById(chart, {
      $pull: { 'config.series': { _id: sid } },
    });

    if (result && chart instanceof Chart) {
      chart.config.series = chart.config.series.filter((c) => !c._id.equals(sid));
    }
  }

  getModelConstructor() {
    return Chart;
  }

  getModuleId(): string {
    return ANALYTICS_MODULE_ID;
  }
}
