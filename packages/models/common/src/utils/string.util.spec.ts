import { escapeHtml } from './string.util';
import { expect } from '@jest/globals';

describe('string util', () => {
  describe('escape()', function () {
    it('escape html', async () => {
      expect(escapeHtml('<b>')).toEqual('&lt;b&gt;');
    });
  });
});
