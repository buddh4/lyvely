import { NumberDataPoint } from "../schemas";
import { DataPointDao } from "./data-point.dao";
import { EntityIdentity } from "../../core/db/db.utils";
import { User } from "../../users";

export abstract class NumberDataPointDao<T extends NumberDataPoint> extends DataPointDao<T> {
  async updateDataPointValue(uid: EntityIdentity<User>, dataPoint: T, newValue: number): Promise<boolean> {
    const result = await this.updateOneById(dataPoint, {
      $set: { value: newValue }
    });

    return result === 1;
  }
}
