import { DataPointDao } from "../../time-series";
import { HabitDataPoint } from "../schemas";
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import module from "../activities.meta";

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
}
