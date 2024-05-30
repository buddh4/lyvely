import { assureStringId } from '@/core';
import { getObjectId, ILyvelyTestingModule } from '@/testing';
import { ProfileUrlGenerator } from './profile-url-generator.service';
import { buildProfileTest } from '@/profiles';

describe('UrlGenrator', () => {
  let urlGenerator: ProfileUrlGenerator;
  let testingModule: ILyvelyTestingModule;

  beforeEach(async () => {
    testingModule = await buildProfileTest('url-gnerator').compile();
    urlGenerator = testingModule.get(ProfileUrlGenerator);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(urlGenerator).toBeDefined();
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

    it('generate simple profile route', () => {
      const pid = getObjectId('test');
      const testUrl = urlGenerator.getAppUrl({
        path: '/so?me/path',
        query: { 't&st': 't&stVal' },
        pid: pid.toString(),
      });
      expect(testUrl.href).toEqual(
        `https://test.com/p/${assureStringId(pid)}/so%3Fme/path?t%26st=t%26stVal`
      );
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

    it('generate profile route', () => {
      const pid = getObjectId('test');
      const testUrl = urlGenerator.getApiUrl({
        path: '/so?me/path',
        query: { 't&st': 't&stVal' },
        pid: pid.toString(),
      });
      expect(testUrl.href).toEqual(
        `https://api.test.com/so%3Fme/path?t%26st=t%26stVal&pid=${assureStringId(pid)}`
      );
    });
  });
});
