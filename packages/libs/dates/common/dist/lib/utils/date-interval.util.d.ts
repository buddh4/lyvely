export interface IntervalTimerIF {
    intervalId?: any;
    timeoutId?: any;
    cancel: () => void;
}
export declare function everyFullMinute(handler: () => void): IntervalTimerIF;
