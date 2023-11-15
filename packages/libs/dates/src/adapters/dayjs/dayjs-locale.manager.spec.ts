import { useDayJsLocaleLoader } from './dayjs-locale.manager';

describe('DayJsLocaleManager', () => {
  const localeManager = useDayJsLocaleLoader();

  afterEach(async () => localeManager.reset());

  describe('setEnabledLocales', () => {
    it('set enabled locale', async () => {
      localeManager.setEnabledLocales(['de']);
      const enabledLocales = localeManager.getEnabledLocales();
      expect(enabledLocales.includes('de')).toEqual(true);
    });

    it('set enabled locale upperCase', async () => {
      localeManager.setEnabledLocales(['DE']);
      const enabledLocales = localeManager.getEnabledLocales();
      expect(enabledLocales.includes('de')).toEqual(true);
    });

    it('can not set unsupported locale', async () => {
      localeManager.setEnabledLocales(['xx']);
      const enabledLocales = localeManager.getEnabledLocales();
      expect(enabledLocales.includes('xx')).toEqual(false);
    });
  });

  describe('getDefaultPreferences', () => {
    it('get default en locale', async () => {
      await localeManager.loadLocale('en-us');
      const defaultPreferences = localeManager.getDefaultPreferences('en-us');
      expect(defaultPreferences.weekStart).toEqual(0);
    });
    it('get default de locale', async () => {
      await localeManager.loadLocale('de');
      const defaultPreferences = localeManager.getDefaultPreferences('de');
      expect(defaultPreferences.weekStart).toEqual(1);
    });
  });
});
