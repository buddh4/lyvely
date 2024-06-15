import { ModuleRegistry } from './components';
import { afterEachTest, createCoreTestingModule } from './testing';
import { TestingModule } from '@nestjs/testing';

describe('CoreModule', () => {
  let moduleRegistry: ModuleRegistry;
  let testingModule: TestingModule;

  const TEST_KEY = 'CoreModule';

  beforeEach(async () => {
    testingModule = await createCoreTestingModule('CoreModule').compile();
    moduleRegistry = testingModule.get(ModuleRegistry);
  });

  afterEach(async () => {
    await afterEachTest(TEST_KEY, testingModule);
  });

  it('core module is registered', () => {
    expect(moduleRegistry.getTypeMeta('core')).toBeDefined();
    expect(moduleRegistry.getTypeMeta('core')?.id).toEqual('core');
    expect(moduleRegistry.getTypeMeta('core')?.name).toEqual('Core');
    expect(moduleRegistry.getTypeMeta('core')?.description).toEqual('Lyvely core module');
  });
});
