import { NumberDataPoint } from "../schemas/number-data-point.schema";
import { DataPointDao } from "./data-point.dao";
import { EntityIdentity } from "../../db/db.utils";
import { User } from "../../users";

export abstract class NumberDataPointDao<T extends NumberDataPoint> extends DataPointDao<T> {
  async updateDataPointValue(uid: EntityIdentity<User>, dataPoint: T, newValue: number) {
    await this.updateOneById(dataPoint, {
      $set: { value: newValue }
    });
  }
}
