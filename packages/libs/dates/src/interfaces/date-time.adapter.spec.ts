import { getEndOfDayTZDate, getFullDayTZDate, getFullDayUTCDate } from './date-time.adapter';

describe('getFullDayUTCDate', function () {
  it('from string with time without tz', async () => {
    const date = getFullDayUTCDate('2021-03-01T12:00:00');
    expect(date.toUTCString()).toEqual('Mon, 01 Mar 2021 00:00:00 GMT');
  });

  it('from string with time with utc tz', async () => {
    const date = getFullDayUTCDate('2021-03-01T12:00:00Z');
    expect(date.toUTCString()).toEqual('Mon, 01 Mar 2021 00:00:00 GMT');
  });

  it('from string without time', async () => {
    const date = getFullDayUTCDate('2021-03-01');
    expect(date.toUTCString()).toEqual('Mon, 01 Mar 2021 00:00:00 GMT');
  });

  it('from string with min tz', async () => {
    const date = getFullDayUTCDate('2021-03-01T15:00:00-11:00');
    expect(date.toUTCString()).toEqual('Mon, 01 Mar 2021 00:00:00 GMT');
  });

  it('from string with max tz', async () => {
    const date = getFullDayUTCDate('2021-03-01T12:00:00+12:00');
    expect(date.toUTCString()).toEqual('Mon, 01 Mar 2021 00:00:00 GMT');
  });
});

describe('getFullDayTZDate', () => {
  it('Europe/Berlin +2 offset should be considered', () => {
    const date = getFullDayTZDate('2024-05-03', 'Europe/Berlin');
    expect(date.toISOString()).toEqual('2024-05-02T22:00:00.000Z');
  });

  it('America/Los_Angeles -7 offset should be considered', () => {
    const date = getFullDayTZDate('2024-05-03', 'America/Los_Angeles');
    expect(date.toISOString()).toEqual('2024-05-03T07:00:00.000Z');
  });
});

describe('getEndOfDayTZDate', () => {
  it('Europe/Berlin +2 offset should be considered', () => {
    const date = getEndOfDayTZDate('2024-05-03', 'Europe/Berlin');
    expect(date.toISOString()).toEqual('2024-05-03T21:59:59.000Z');
  });

  it('America/Los_Angeles -7 offset should be considered', () => {
    const date = getEndOfDayTZDate('2024-05-03', 'America/Los_Angeles');
    expect(date.toISOString()).toEqual('2024-05-04T06:59:59.000Z');
  });
});
