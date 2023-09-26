import { buildTest } from '@lyvely/testing';
import { i18nTestPlugin } from '../testing';
import { I18n } from '../components';

describe('I18nModuleLoader', () => {
  let i18n: I18n;

  beforeEach(async () => {
    const test = await buildTest('I18nModuleLoader')
      .plugins([i18nTestPlugin])
      //  .providers([I18n])
      .compile();
    i18n = test.get(I18n);
  });

  it('registry is defined', () => {
    expect(i18n).toBeDefined();
  });
});
