import { UrlGenerator } from './url-generator.service';
import { afterEachTest, createCoreTestingModule } from '../testing';
import { TestingModule } from '@nestjs/testing';

describe('UrlGenerator', () => {
  let urlGenerator: UrlGenerator;
  let testingModule: TestingModule;

  const TEST_KEY = 'UrlGenerator';

  beforeEach(async () => {
    testingModule = await createCoreTestingModule(TEST_KEY, [UrlGenerator]).compile();
    urlGenerator = testingModule.get(UrlGenerator);
  });

  afterEach(async () => {
    await afterEachTest(TEST_KEY, testingModule);
  });

  describe('getAppUrl', () => {
    it('generate base app url', () => {
      const testUrl = urlGenerator.getAppUrl();
      expect(testUrl.href).toEqual('https://test.com/');
    });

    it('generate base app url with search param', () => {
      const testUrl = urlGenerator.getAppUrl({ query: { test: 'testVal', test2: 'testVal2' } });
      expect(testUrl.href).toEqual('https://test.com/?test=testVal&test2=testVal2');
    });

    it('generate base app url with path and search param', () => {
      const testUrl = urlGenerator.getAppUrl({
        path: 'some/path',
        query: { test: 'testVal', test2: 'testVal2' },
      });
      expect(testUrl.href).toEqual('https://test.com/some/path?test=testVal&test2=testVal2');
    });

    it('generate base app url with path with leading slash', () => {
      const testUrl = urlGenerator.getAppUrl({
        path: '/some/path',
        query: { test: 'testVal', test2: 'testVal2' },
      });
      expect(testUrl.href).toEqual('https://test.com/some/path?test=testVal&test2=testVal2');
    });

    it('url is encoded', () => {
      const testUrl = urlGenerator.getAppUrl({ path: '/so?me/path', query: { 't&st': 't&stVal' } });
      expect(testUrl.href).toEqual('https://test.com/so%3Fme/path?t%26st=t%26stVal');
    });
  });

  describe('getApiUrl', () => {
    it('generate base app url', () => {
      const testUrl = urlGenerator.getApiUrl();
      expect(testUrl.href).toEqual('https://api.test.com/');
    });

    it('generate base app url with search param', () => {
      const testUrl = urlGenerator.getApiUrl({ query: { test: 'testVal', test2: 'testVal2' } });
      expect(testUrl.href).toEqual('https://api.test.com/?test=testVal&test2=testVal2');
    });

    it('generate base app url with path and search param', () => {
      const testUrl = urlGenerator.getApiUrl({
        path: 'some/path',
        query: { test: 'testVal', test2: 'testVal2' },
      });
      expect(testUrl.href).toEqual('https://api.test.com/some/path?test=testVal&test2=testVal2');
    });

    it('generate base app url with path with leading slash', () => {
      const testUrl = urlGenerator.getApiUrl({
        path: '/some/path',
        query: { test: 'testVal', test2: 'testVal2' },
      });
      expect(testUrl.href).toEqual('https://api.test.com/some/path?test=testVal&test2=testVal2');
    });

    it('url is encoded', () => {
      const testUrl = urlGenerator.getApiUrl({ path: '/so?me/path', query: { 't&st': 't&stVal' } });
      expect(testUrl.href).toEqual('https://api.test.com/so%3Fme/path?t%26st=t%26stVal');
    });
  });
});
