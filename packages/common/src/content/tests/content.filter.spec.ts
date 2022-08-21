import { ContentFilter } from '../../index';
import { TestContent } from './src/test-content.model';

describe('Content Filter', () => {

  describe('tags filter', function () {
    it('filter by tags success', async () => {
      const filter = new ContentFilter();
      filter.update({ tagId: 'test' });
      const result = filter.run(new TestContent({ tagIds: ['test'] }));
      expect(result).toEqual(true);
    });

    it('filter by tags fails', async () => {
      const filter = new ContentFilter();
      filter.update({ tagId: 'test' });
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
