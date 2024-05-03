import { useDayJsLocaleManager } from './dayjs-locale.manager';
import { dateTime } from '../../interfaces';

describe('DayJsDateTimeAdapter', () => {
  const localeManager = useDayJsLocaleManager();

  afterEach(async () => localeManager.reset());

  describe('toTZ', () => {
    it('should preserve local time if preserveTime is true', () => {
      const dt = dateTime(new Date('2021-12-31T16:00:00'));
      const translatedDate = dt.toTZ('America/Los_Angeles', true);
      expect(translatedDate.format()).toBe('2021-12-31T16:00:00-08:00');
    });
  });
});
