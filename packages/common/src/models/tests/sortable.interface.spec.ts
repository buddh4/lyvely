import { sortBySortOrder } from '@/models';

describe('Sortable', () => {
  describe('sortBySortOrder', function () {
    it('lower sort order will be first', async () => {
      const models = [
        { name: 'b', getSortOrder: () => 1 },
        { name: 'a', getSortOrder: () => 0 },
      ];
      models.sort(sortBySortOrder);
      expect(models[0].name).toEqual('a');
      expect(models[1].name).toEqual('b');
    });

    it('equal sortOrder does not change order', async () => {
      const models = [
        { name: 'a', getSortOrder: () => 0 },
        { name: 'b', getSortOrder: () => 0 },
      ];
      models.sort(sortBySortOrder);
      expect(models[0].name).toEqual('a');
      expect(models[1].name).toEqual('b');
    });

    it('element without sortOrder will sorted last ', async () => {
      const models = [
        { name: 'c', getSortOrder: () => undefined },
        { name: 'a', getSortOrder: () => 0 },
        { name: 'b', getSortOrder: () => 0 },
      ];
      models.sort(sortBySortOrder);
      expect(models[0].name).toEqual('a');
      expect(models[1].name).toEqual('b');
      expect(models[2].name).toEqual('c');
    });

    it('two elements without sortOrder will sorted last', async () => {
      const models = [
        { name: 'b', getSortOrder: () => undefined },
        { name: 'c', getSortOrder: () => undefined },
        { name: 'a', getSortOrder: () => 0 },
      ];
      models.sort(sortBySortOrder);
      expect(models[0].name).toEqual('a');
      expect(models[1].name).toEqual('b');
      expect(models[2].name).toEqual('c');
    });
  });
});
