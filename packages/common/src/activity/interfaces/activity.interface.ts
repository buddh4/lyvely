import { ITimeSeriesContent, INumberDataPointConfig } from '../../time-series';

export enum ActivityType {
    Task = 'Task',
    Habit = 'Habit'
}

export interface IActivity<TID = any> extends ITimeSeriesContent<INumberDataPointConfig, TID> {
    title: string;
    score: number;
}

export function isActivity(obj: any): obj is IActivity {
    return obj?.type && [ActivityType.Task, ActivityType.Habit].includes(obj.type);
}



/*export enum GoalState {
    Pending,
    Success,
    Failed
}

export interface Goal {
    activityId: string;
    units: number;
    progress: number;
    logs: string[]; // log successes by calendar will be updated on acitivity update if units is reached for a calendar
}

/*export interface Challenge extends TimeableContentLog {
    start: Date;
    end: Date;
    state: GoalState;
    value: number;
    goals: Goal[];
}*/




