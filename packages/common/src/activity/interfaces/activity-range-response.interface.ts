import { IHabit } from '../habit';
import { ITask } from '../task';
import { NumberDataPointDto } from "../../time-series";

export interface IActivityRangeResponse {
    habits: IHabit[];
    dataPoints: NumberDataPointDto[];
    tasks: ITask[];
}
