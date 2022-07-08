import { DataPointDao } from "../../time-series";
import { HabitDataPoint } from "../schemas";
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import module from "../activities.meta";
import { EntityIdentity } from "../../db/db.utils";
import { User } from "../../users";

@Injectable()
export class HabitDataPointDao extends DataPointDao<HabitDataPoint> {

    @InjectModel(HabitDataPoint.name)
    protected model: Model<HabitDataPoint>;

    getModelConstructor() {
        return HabitDataPoint;
    }

    getModuleId(): string {
        return module.id;
    }

  async updateDataPointValue(uid: EntityIdentity<User>, dataPoint: HabitDataPoint, newValue: any): Promise<boolean> {
      const result = await this.updateOneByIdSet(dataPoint, { value: newValue });
      return result === 1;
  }
}
