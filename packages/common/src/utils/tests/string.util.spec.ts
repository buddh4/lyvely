import { escapeHTML } from '@/utils';
import { expect } from '@jest/globals';

describe('string util', () => {
  describe('escape()', function () {
    it('escape html', async () => {
      expect(escapeHTML('<b>')).toEqual('&lt;b&gt;');
    });
  });
});
