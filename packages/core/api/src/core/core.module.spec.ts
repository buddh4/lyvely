import { ModuleRegistry } from './components';
import { createCoreTestingModule, ICoreTestModule } from './testing';

describe('CoreModule', () => {
  let moduleRegistry: ModuleRegistry;
  let testingModule: ICoreTestModule;

  beforeEach(async () => {
    testingModule = await createCoreTestingModule('CoreModule').compile();
    moduleRegistry = testingModule.get(ModuleRegistry);
  });

  afterEach(async () => {
    await testingModule.afterEach();
  });

  it('core module is registered', () => {
    expect(moduleRegistry.getTypeMeta('core')).toBeDefined();
    expect(moduleRegistry.getTypeMeta('core')?.id).toEqual('core');
    expect(moduleRegistry.getTypeMeta('core')?.name).toEqual('Core');
    expect(moduleRegistry.getTypeMeta('core')?.description).toEqual('Lyvely core module');
  });
});
