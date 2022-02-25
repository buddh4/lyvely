import { IHabit } from '../habit';
import { IActivityDataPoint } from './activity-data-point.interface';
import { ITask } from '../task';

export interface IActivityRangeResponse {
    habits: IHabit[];
    dataPoints: IActivityDataPoint[];
    tasks: ITask[];
}