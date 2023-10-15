import { importModules, getModule } from '@/core/modules';

describe('module registry', () => {
  describe('import modules', () => {
    it('single module import', async () => {
      const modules = await importModules(import('./testing/moduleA/module'));
      expect(modules?.length).toEqual(1);
      expect(modules[0].getId()).toEqual('moduleA');
      expect(getModule('moduleA')?.getId()).toEqual('moduleA');
    });

    it('eager single module import', async () => {
      const modules = await importModules(await import('./testing/moduleA/module'));
      expect(modules?.length).toEqual(1);
      expect(modules[0].getId()).toEqual('moduleA');
      expect(getModule('moduleA')?.getId()).toEqual('moduleA');
    });

    it('glob import module', async () => {
      const modules = await importModules({
        './testing/moduleA/module.ts': import('./testing/moduleA/module'),
        './testing/moduleB/module.ts': import('./testing/moduleB/module'),
      });
      expect(modules?.length).toEqual(2);
      expect(getModule('moduleA')?.getId()).toEqual('moduleA');
      expect(getModule('moduleB')?.getId()).toEqual('moduleB');
    });

    it('eager glob import module', async () => {
      const modules = await importModules({
        './testing/moduleA/module.ts': await import('./testing/moduleA/module'),
        './testing/moduleB/module.ts': await import('./testing/moduleB/module'),
      });
      expect(modules?.length).toEqual(2);
      expect(getModule('moduleA')?.getId()).toEqual('moduleA');
      expect(getModule('moduleB')?.getId()).toEqual('moduleB');
    });
  });
});
