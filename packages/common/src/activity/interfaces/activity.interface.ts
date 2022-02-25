import { ITimeSeriesContent } from '../../time-series';

export enum ActivityType {
    Task = 'Task',
    Habit = 'Habit'
}

export interface IActivity extends ITimeSeriesContent {
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
    logs: string[]; // log successes by timing will be updated on acitivity update if units is reached for a timing
}

/*export interface Challenge extends TimeableContentLog {
    start: Date;
    end: Date;
    state: GoalState;
    value: number;
    goals: Goal[];
}*/




