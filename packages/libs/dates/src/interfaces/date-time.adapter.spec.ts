import { getFullDayDate } from './date-time.adapter';

describe('getFullDayDate', function () {
  it('from string with time without tz', async () => {
    const date = getFullDayDate('2021-03-01T12:00:00');
    expect(date.toUTCString()).toEqual('Mon, 01 Mar 2021 00:00:00 GMT');
  });

  it('from string with time with utc tz', async () => {
    const date = getFullDayDate('2021-03-01T12:00:00Z');
    expect(date.toUTCString()).toEqual('Mon, 01 Mar 2021 00:00:00 GMT');
  });

  it('from string without time', async () => {
    const date = getFullDayDate('2021-03-01');
    expect(date.toUTCString()).toEqual('Mon, 01 Mar 2021 00:00:00 GMT');
  });

  it('from string with min tz', async () => {
    const date = getFullDayDate('2021-03-01T15:00:00-11:00');
    expect(date.toUTCString()).toEqual('Mon, 01 Mar 2021 00:00:00 GMT');
  });

  it('from string with max tz', async () => {
    const date = getFullDayDate('2021-03-01T12:00:00+12:00');
    expect(date.toUTCString()).toEqual('Mon, 01 Mar 2021 00:00:00 GMT');
  });
});
