import { ModuleRegistry } from './components';
import { createCoreTestingModule } from './testing/core-test.util';

describe('SendInvitations', () => {
  let moduleRegistry: ModuleRegistry;

  beforeEach(async () => {
    const test = await createCoreTestingModule('core-module-test').compile();
    moduleRegistry = test.get(ModuleRegistry);
  });

  it('registry is defined', () => {
    expect(moduleRegistry).toBeDefined();
  });

  it('core module is registered', () => {
    expect(moduleRegistry.getTypeMeta('core')).toBeDefined();
    expect(moduleRegistry.getTypeMeta('core')?.id).toEqual('core');
    expect(moduleRegistry.getTypeMeta('core')?.name).toEqual('Core');
    expect(moduleRegistry.getTypeMeta('core')?.description).toEqual('Lyvely core module');
  });
});
