import { buildTest, createTestExecutionContext, LyvelyTestingModule } from '@/testing';
import { ExecutionContext } from '@nestjs/common';
import { Feature, FeatureGuard, FeatureModule, FeatureRegistry } from '../';

@Feature('test')
class TestController {
  @Feature('test.sub')
  testHandler() {
    return null;
  }

  @Feature('test.sub.specific')
  specificHandler() {
    return null;
  }
}

describe('ProfileGuard', () => {
  let testingModule: LyvelyTestingModule;
  let featureGuard: FeatureGuard;
  let featureRegistry: FeatureRegistry;
  let context: ExecutionContext;

  const TEST_KEY = 'feature-guard';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY).imports([FeatureModule]).compile();
    featureGuard = testingModule.get<FeatureGuard>(FeatureGuard);
    featureRegistry = testingModule.get<FeatureRegistry>(FeatureRegistry);

    featureRegistry.registerFeatures([
      {
        id: 'test',
        name: 'Test',
        moduleId: 'test',
        enabled: true,
        description: 'Some test feature',
      },
      {
        id: 'test.sub',
        name: 'Test sub feature',
        moduleId: 'test',
        enabled: false,
        description: 'Some test sub feature',
      },
      {
        id: 'test.sub.specific',
        name: 'Test specific sub feature',
        moduleId: 'test',
        enabled: true,
        description: 'Specific test sub feature',
      },
    ]);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(featureGuard).toBeDefined();
    expect(featureRegistry).toBeDefined();
  });

  describe('canActivate()', () => {
    it('can access enabled feature', async () => {
      context = createTestExecutionContext({ class: TestController });
      const result = await featureGuard.canActivate(context);
      expect(result).toEqual(true);
    });

    it('can not access disabled feature', async () => {
      context = createTestExecutionContext({
        class: TestController,
        handler: new TestController().testHandler,
      });
      const result = await featureGuard.canActivate(context);
      expect(result).toEqual(false);
    });

    it('can not access sub feature if main feature is disabled', async () => {
      context = createTestExecutionContext({
        class: TestController,
        handler: new TestController().specificHandler,
      });

      const result = await featureGuard.canActivate(context);
      expect(result).toEqual(false);
    });

    it('can access manually enabled feature', async () => {
      context = createTestExecutionContext({
        class: TestController,
        handler: new TestController().testHandler,
      });

      featureRegistry.getFeature('test.sub')!.enabled = true;
      const result = await featureGuard.canActivate(context);
      expect(result).toEqual(true);
    });
  });
});
