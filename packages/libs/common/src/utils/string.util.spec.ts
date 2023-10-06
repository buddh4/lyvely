import { escapeHtml } from './string.util';

describe('string util', () => {
  describe('escape()', function () {
    it('escape html', async () => {
      expect(escapeHtml('<b>')).toEqual('&lt;b&gt;');
    });
  });
});
