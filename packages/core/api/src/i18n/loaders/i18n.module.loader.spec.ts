import { buildTest, ILyvelyTestingModule } from '@/testing';
import { i18nITestPlugin } from '../testing';
import { I18n } from '../components';

describe('I18nModuleLoader', () => {
  let i18n: I18n;
  let testingModule: ILyvelyTestingModule;

  beforeEach(async () => {
    testingModule = await buildTest('I18nModuleLoader').plugins([i18nITestPlugin]).compile();
    i18n = testingModule.get(I18n);
  }, 50000);

  afterEach(async () => {
    await testingModule.afterEach();
  });

  it('Test module prefix', async () => {
    const translation = i18n.t('i18n.test.hello', { locale: 'de' });
    expect(translation).toEqual('Hallo');
  }, 10000);

  it('Test base translation are merged', async () => {
    const translation = i18n.t('i18n.test.mergeThis', { locale: 'de' });
    expect(translation).toEqual('Es wurde zusammengeführt.');
  }, 10000);
});
