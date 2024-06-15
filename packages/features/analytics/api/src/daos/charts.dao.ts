import { assureObjectId, assureStringId, ContentTypeDao, type DocumentIdentity } from '@lyvely/api';
import { Chart, ChartSeriesConfig } from '../schemas';
import { IChartSeriesConfig } from '@lyvely/analytics-interface';
import { findAndReplace } from '@lyvely/common';
import { Dao } from '@lyvely/api';

@Dao(Chart)
export class ChartsDao extends ContentTypeDao<Chart> {
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
}
