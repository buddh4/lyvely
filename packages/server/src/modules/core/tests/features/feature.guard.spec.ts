import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { createTestExecutionContext } from '@server/modules/test/utils/test-execution-context.util';
import { FeatureGuard } from '../../features/feature.guard';
import { createContentTestingModule } from '../../../test/utils/test.utils';
import { ExecutionContext } from '@nestjs/common';
import { Feature } from '../../features/feature.decorator';
import { FeatureRegistry } from '../../features/feature.registry';

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
  let testingModule: TestingModule;
  let featureGuard: FeatureGuard;
  let featureRegistry: FeatureRegistry;
  let context: ExecutionContext;

  const TEST_KEY = 'feature-guard';

  beforeEach(async () => {
    testingModule = await createContentTestingModule(TEST_KEY).compile();
    featureGuard = testingModule.get<FeatureGuard>(FeatureGuard);
    featureRegistry = testingModule.get<FeatureRegistry>(FeatureRegistry);

    featureRegistry.registerFeatures( [
      {
        id: 'test',
        name: 'Test',
        moduleId: 'test',
        enabled: true,
        description: 'Some test feature'
      },
      {
        id: 'test.sub',
        name: 'Test sub feature',
        moduleId: 'test',
        enabled: false,
        description: 'Some test sub feature'
      },
      {
        id: 'test.sub.specific',
        name: 'Test specific sub feature',
        moduleId: 'test',
        enabled: true,
        description: 'Specific test sub feature'
      }
    ]);
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
        handler:(new TestController()).testHandler
      });
      const result = await featureGuard.canActivate(context);
      expect(result).toEqual(false);
    });

    it('can not access sub feature if main feature is disabled', async () => {
      context = createTestExecutionContext({
        class: TestController,
        handler:(new TestController()).specificHandler
      });

      const result = await featureGuard.canActivate(context);
      expect(result).toEqual(false);
    });

    it('can access manually enabled feature', async () => {
      context = createTestExecutionContext({
        class: TestController,
        handler:(new TestController()).testHandler
      });

      featureRegistry.getFeature('test.sub').enabled = true;
      const result = await featureGuard.canActivate(context);
      expect(result).toEqual(true);
    });
  });
});
