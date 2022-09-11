import { User } from '../../../modules/users';
import { Profile  } from '../../../modules/profiles';
import { DataPointService } from "./data-point.service";
import { NumberDataPoint, NumberTimeSeriesContent } from "../schemas";

export abstract class NumberDataPointService<
    TimeSeriesModel extends NumberTimeSeriesContent,
    DataPointModel extends NumberDataPoint> extends DataPointService<TimeSeriesModel, DataPointModel, number> {

  protected async updateDataPointValue(profile: Profile, user: User, dataPoint: DataPointModel, model: TimeSeriesModel, newValue: number) {
    if(dataPoint.value === newValue) {
      return;
    }

   await this.dataPointDao.updateDataPointValue(user, dataPoint, Math.min(newValue, model.dataPointConfig.max));
  }
}
