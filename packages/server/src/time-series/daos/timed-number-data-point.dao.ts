import { DataPointUpdate, TimedNumberDataPoint } from "../schemas/number-data-point.schema";
import { NumberDataPointDao } from "./number-data-point.dao";
import { EntityIdentity } from "../../db/db.utils";
import { User } from "../../users";

export abstract class TimedNumberDataPointDao<T extends TimedNumberDataPoint> extends NumberDataPointDao<T> {
  async updateDataPointValue(uid: EntityIdentity<User>, dataPoint: T, newValue: number): Promise<boolean> {
    const result = await this.updateOneById(dataPoint, {
      $set: { value: newValue },
      $push: { history: DataPointUpdate.createByDataPointUpdate(uid, dataPoint, newValue) }
    });

    return result === 1;
  }
}
