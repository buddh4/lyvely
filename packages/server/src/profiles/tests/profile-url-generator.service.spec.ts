import { expect } from '@jest/globals';
import { assureStringId, UrlGenerator } from '@/core';
import { createBasicTestingModule, getObjectId } from '@/test';
import { TestingModule } from '@nestjs/testing';
import { ProfileUrlGenerator } from '@/profiles/services/profile-url-generator.service';

describe('UrlGenrator', () => {
  let urlGenerator: ProfileUrlGenerator;
  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await createBasicTestingModule('url-gnerator').compile();
    urlGenerator = testingModule.get(ProfileUrlGenerator);
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
      const testUrl = urlGenerator.getAppUrl({ params: { test: 'testVal', test2: 'testVal2' } });
      expect(testUrl.href).toEqual('https://test.com/?test=testVal&test2=testVal2');
    });

    it('generate base app url with path and search param', () => {
      const testUrl = urlGenerator.getAppUrl({ path: 'some/path', params: { test: 'testVal', test2: 'testVal2' } });
      expect(testUrl.href).toEqual('https://test.com/some/path?test=testVal&test2=testVal2');
    });

    it('generate base app url with path with leading slash', () => {
      const testUrl = urlGenerator.getAppUrl({ path: '/some/path', params: { test: 'testVal', test2: 'testVal2' } });
      expect(testUrl.href).toEqual('https://test.com/some/path?test=testVal&test2=testVal2');
    });

    it('url is encoded', () => {
      const testUrl = urlGenerator.getAppUrl({ path: '/so?me/path', params: { 't&st': 't&stVal' } });
      expect(testUrl.href).toEqual('https://test.com/so%3Fme/path?t%26st=t%26stVal');
    });

    it('generate simple profile route', () => {
      const pid = getObjectId('test');
      const testUrl = urlGenerator.getAppUrl({
        path: '/so?me/path',
        params: { 't&st': 't&stVal' },
        pid: getObjectId('test'),
      });
      expect(testUrl.href).toEqual(`https://test.com/p/${assureStringId(pid)}/so%3Fme/path?t%26st=t%26stVal`);
    });
  });

  describe('getApiUrl', () => {
    it('generate base app url', () => {
      const testUrl = urlGenerator.getApiUrl();
      expect(testUrl.href).toEqual('https://api.test.com/');
    });

    it('generate base app url with search param', () => {
      const testUrl = urlGenerator.getApiUrl({ params: { test: 'testVal', test2: 'testVal2' } });
      expect(testUrl.href).toEqual('https://api.test.com/?test=testVal&test2=testVal2');
    });

    it('generate base app url with path and search param', () => {
      const testUrl = urlGenerator.getApiUrl({ path: 'some/path', params: { test: 'testVal', test2: 'testVal2' } });
      expect(testUrl.href).toEqual('https://api.test.com/some/path?test=testVal&test2=testVal2');
    });

    it('generate base app url with path with leading slash', () => {
      const testUrl = urlGenerator.getApiUrl({ path: '/some/path', params: { test: 'testVal', test2: 'testVal2' } });
      expect(testUrl.href).toEqual('https://api.test.com/some/path?test=testVal&test2=testVal2');
    });

    it('url is encoded', () => {
      const testUrl = urlGenerator.getApiUrl({ path: '/so?me/path', params: { 't&st': 't&stVal' } });
      expect(testUrl.href).toEqual('https://api.test.com/so%3Fme/path?t%26st=t%26stVal');
    });

    it('generate profile route', () => {
      const pid = getObjectId('test');
      const testUrl = urlGenerator.getApiUrl({
        path: '/so?me/path',
        params: { 't&st': 't&stVal' },
        pid: getObjectId('test'),
      });
      expect(testUrl.href).toEqual(`https://api.test.com/so%3Fme/path?t%26st=t%26stVal&pid=${assureStringId(pid)}`);
    });
  });
});
