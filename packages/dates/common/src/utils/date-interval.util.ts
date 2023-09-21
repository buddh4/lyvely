export interface IntervalTimerIF {
  intervalId?: any;
  timeoutId?: any;
  cancel: () => void;
}

export function everyFullMinute(handler: () => void) {
  const now = new Date();
  const secondsUntilNextMinute = 60 - now.getSeconds();

  const startIntervalCallback = function (interval: IntervalTimerIF) {
    handler();
    interval.intervalId = setInterval(handler, 60000); // Then every minute after that
  };

  const interval = {
    intervalId: undefined,
    timeoutId: undefined,
    cancel: function () {
      clearTimeout(this.timeoutId);
      clearInterval(this.intervalId);
    },
  } as IntervalTimerIF;

  interval.timeoutId = setTimeout(startIntervalCallback, secondsUntilNextMinute * 1000, interval);

  return interval;
}
