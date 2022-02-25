import { ContentFilter } from '../../index';
import { TestContent } from './src/test-content.model';

describe('Content Filter', () => {

  describe('category filter', function () {
    it('filter by category success', async () => {
      const filter = new ContentFilter();
      filter.update({ category: 'test' });
      const result = filter.run(new TestContent({ categories: ['test'] }));
      expect(result).toEqual(true);
    });

    it('filter by category fails', async () => {
      const filter = new ContentFilter();
      filter.update({ category: 'test' });
      const result = filter.run(new TestContent());
      expect(result).toEqual(false);
    });
  });

  describe('archived filter', function () {
    it('archived filter active by default', async () => {
      const filter = new ContentFilter();
      const result = filter.run(new TestContent({ archived: true }));
      expect(result).toEqual(false);
    });

    it('archive filter success', async () => {
      const filter = new ContentFilter();
      filter.update({ archived: true })
      const result = filter.run(new TestContent({ archived: true }));
      expect(result).toEqual(true);
    });

    it('archive filter fail', async () => {
      const filter = new ContentFilter();
      filter.update({ archived: true })
      const result = filter.run(new TestContent({ archived: false }));
      expect(result).toEqual(false);
    });
  });
});