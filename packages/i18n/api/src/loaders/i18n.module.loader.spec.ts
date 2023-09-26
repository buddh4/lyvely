import { buildTest } from '@lyvely/testing';
import { i18nTestPlugin } from '../testing';
import { I18n } from '../components';

describe('I18nModuleLoader', () => {
  let i18n: I18n;

  beforeEach(async () => {
    const test = await buildTest('I18nModuleLoader').plugins([i18nTestPlugin]).compile();
    i18n = test.get(I18n);
  }, 50000);

  it('registry is defined', async () => {
    const translation = i18n.t('i18n.test.hello', { locale: 'de' });
    expect(translation).toEqual('Hallo');
  }, 10000);
});
