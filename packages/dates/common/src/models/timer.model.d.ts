import { BaseModel } from '@lyvely/core';
export declare class TimeSpanModel extends BaseModel<TimeSpanModel> {
    uid?: any;
    from: number;
    to?: number;
    constructor(uid?: any);
}
export declare class TimerModel extends BaseModel<TimerModel> {
    uid?: any;
    spans: TimeSpanModel[];
    start(uid?: any): TimeSpanModel | undefined;
    stop(): void;
    overwrite(newValue: number, uid?: any): void;
    getLatestSpan(): TimeSpanModel | undefined;
    isStarted(): boolean;
    calculateTotalSpan(includeOpenSpan?: boolean): number;
    private calculateSpan;
}
