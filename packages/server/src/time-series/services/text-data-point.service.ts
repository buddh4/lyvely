import { User } from '@/users';
import { Profile } from '@/profiles';
import { DataPointService } from './data-point.service';
import { TextDataPoint, TextTimeSeriesContent } from '../schemas';

export abstract class TextDataPointService<
  TimeSeriesModel extends TextTimeSeriesContent = TextTimeSeriesContent,
  DataPointModel extends TextDataPoint = TextDataPoint,
> extends DataPointService<TimeSeriesModel, DataPointModel, string> {
  protected async updateDataPointValue(
    profile: Profile,
    user: User,
    dataPoint: DataPointModel,
    model: TimeSeriesModel,
    newValue: string,
  ) {
    if (dataPoint.value === newValue) return;
    await this.dataPointDao.updateDataPointValue(user, dataPoint, newValue);
  }
}
