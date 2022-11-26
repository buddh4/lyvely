import { ContentFilter, ContentMetadataModel } from '@/content';
import { TestContent } from './src/test-content.model';

describe('Content Filter', () => {
  describe('tags filter', function () {
    it('filter by tags success', async () => {
      const filter = new ContentFilter({ tagId: 'test' });
      const result = filter.check(new TestContent({ tagIds: ['test'] }));
      expect(result).toEqual(true);
    });

    it('filter by tags fails', async () => {
      const filter = new ContentFilter({ tagId: 'test' });
      const result = filter.check(new TestContent());
      expect(result).toEqual(false);
    });
  });

  describe('archived filter', function () {
    it('archived entries are excluded by default', async () => {
      const filter = new ContentFilter();
      const result = filter.check(new TestContent({ meta: new ContentMetadataModel({ isArchived: true }) }));
      expect(result).toEqual(false);
    });

    it('archive filter includes archived content', async () => {
      const filter = new ContentFilter({ archived: true });
      const result = filter.check(new TestContent({ meta: new ContentMetadataModel({ isArchived: true }) }));
      expect(result).toEqual(true);
    });

    it('archive filter does not include non archived content', async () => {
      const filter = new ContentFilter({ archived: true });
      const result = filter.check(new TestContent({ meta: new ContentMetadataModel({ isArchived: false }) }));
      expect(result).toEqual(false);
    });
  });
});
