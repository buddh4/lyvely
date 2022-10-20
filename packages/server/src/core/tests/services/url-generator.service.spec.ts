import { expect } from '@jest/globals';
import { UrlGenerator } from '@/core';
import { createBasicTestingModule } from '@/test';
import { TestingModule } from '@nestjs/testing';

describe('UrlGenrator', () => {
  let urlGenerator: UrlGenerator;
  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await createBasicTestingModule('url-gnerator').compile();
    urlGenerator = testingModule.get(UrlGenerator);
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
      const testUrl = urlGenerator.getAppUrl({ test: 'testVal', test2: 'testVal2' });
      expect(testUrl.href).toEqual('https://test.com/?test=testVal&test2=testVal2');
    });

    it('generate base app url with path and search param', () => {
      const testUrl = urlGenerator.getAppUrl('some/path', { test: 'testVal', test2: 'testVal2' });
      expect(testUrl.href).toEqual('https://test.com/some/path?test=testVal&test2=testVal2');
    });

    it('generate base app url with path with leading slash', () => {
      const testUrl = urlGenerator.getAppUrl('/some/path', { test: 'testVal', test2: 'testVal2' });
      expect(testUrl.href).toEqual('https://test.com/some/path?test=testVal&test2=testVal2');
    });

    it('url is encoded', () => {
      const testUrl = urlGenerator.getAppUrl('/so?me/path', { 't&st': 't&stVal' });
      expect(testUrl.href).toEqual('https://test.com/so%3Fme/path?t%26st=t%26stVal');
    });
  });
});
