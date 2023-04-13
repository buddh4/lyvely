export function everyFullMinute(handler: () => void) {
  const now = new Date();
  const secondsUntilNextMinute = 60 - now.getSeconds();

  const startIntervalCallback = function (interval) {
    handler();
    interval.intervalId = setInterval(handler, 60000); // Then every minute after that
  };

  const interval = {
    intervalId: null,
    timeoutId: null,
    cancel: function () {
      clearTimeout(this.timeoutId);
      clearInterval(this.intervalId);
    },
  };

  interval.timeoutId = setTimeout(startIntervalCallback, secondsUntilNextMinute * 1000, interval);

  return interval;
}
