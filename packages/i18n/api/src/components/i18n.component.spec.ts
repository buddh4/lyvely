import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { createCoreTestingModule } from '@lyvely/testing';
import { I18n } from './';

describe('I18n', () => {
  let testingModule: TestingModule;
  let i18n: I18n;

  const TEST_KEY = 'I18n';

  beforeEach(async () => {
    testingModule = await createCoreTestingModule(TEST_KEY).compile();
    i18n = testingModule.get(I18n);
  });

  it('should be defined', () => {
    expect(i18n).toBeDefined();
  });

  describe('translate()', () => {
    it('translate with string key and locale', async () => {
      expect(i18n.t('test.testKey', { locale: 'en' })).toEqual('Test Value');
    });

    it('translate with translatable and locale', async () => {
      expect(i18n.t({ key: 'test.testKey' }, { locale: 'en' })).toEqual('Test Value');
    });

    it('translate with fallback', async () => {
      expect(i18n.t('test.enOnly', { locale: 'de' })).toEqual('Only available in english');
    });

    it('translate to no default lang', async () => {
      expect(i18n.t('test.testKey', { locale: 'de' })).toEqual('Test Wert');
    });

    it('translate locale with region', async () => {
      expect(i18n.t('test.testKey', { locale: 'de-DE' })).toEqual('Test Wert');
    });

    it('translate with param', async () => {
      expect(
        i18n.t({ key: 'test.testWithParams', params: { value: 'VALUE' } }, { locale: 'en' }),
      ).toEqual('Test VALUE');
    });

    it('translate nested', async () => {
      expect(i18n.t({ key: 'test.nested.test.key' }, { locale: 'en' })).toEqual('Nested Value');
    });
  });
});
