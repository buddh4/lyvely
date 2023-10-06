export function everyFullMinute(handler) {
    const now = new Date();
    const secondsUntilNextMinute = 60 - now.getSeconds();
    const startIntervalCallback = function (interval) {
        handler();
        interval.intervalId = setInterval(handler, 60000);
    };
    const interval = {
        intervalId: undefined,
        timeoutId: undefined,
        cancel: function () {
            clearTimeout(this.timeoutId);
            clearInterval(this.intervalId);
        },
    };
    interval.timeoutId = setTimeout(startIntervalCallback, secondsUntilNextMinute * 1000, interval);
    return interval;
}
//# sourceMappingURL=date-interval.util.js.map