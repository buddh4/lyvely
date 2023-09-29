import { TestingModule } from '@nestjs/testing';
import { buildTest } from '@lyvely/testing';
import { I18n } from './';
import { i18nTestPlugin } from '../testing';

describe('I18n', () => {
  let testingModule: TestingModule;
  let i18n: I18n;

  const TEST_KEY = 'I18n';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY).plugins([i18nTestPlugin]).compile();
    i18n = testingModule.get(I18n);
  });

  it('should be defined', () => {
    expect(i18n).toBeDefined();
  });

  describe('translate()', () => {
    it('translate with string key and locale', async () => {
      expect(i18n.t('i18n.test.testKey', { locale: 'en' })).toEqual('Test Value');
    });

    it('translate with translatable and locale', async () => {
      expect(i18n.t({ key: 'i18n.test.testKey' }, { locale: 'en' })).toEqual('Test Value');
    });

    it('translate with fallback', async () => {
      expect(i18n.t('i18n.test.enOnly', { locale: 'de' })).toEqual('Only available in english');
    });

    it('translate to no default lang', async () => {
      expect(i18n.t('i18n.test.testKey', { locale: 'de' })).toEqual('Test Wert');
    });

    it('translate locale with region', async () => {
      expect(i18n.t('i18n.test.testKey', { locale: 'de-DE' })).toEqual('Test Wert');
    });

    it('translate with param', async () => {
      expect(
        i18n.t({ key: 'i18n.test.testWithParams', params: { value: 'VALUE' } }, { locale: 'en' }),
      ).toEqual('Test VALUE');
    });

    it('translate nested', async () => {
      expect(i18n.t({ key: 'i18n.test.nested.test.key' }, { locale: 'en' })).toEqual(
        'Nested Value',
      );
    });
  });
});
