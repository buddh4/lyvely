import { buildTest, ILyvelyTestingModule } from '@/testing';
import { IPolicy } from '../interfaces';
import { Injectable } from '@nestjs/common';
import { LyvelyModule } from '@/core';
import { usePolicyRegistry } from './policy.registry';
import { InjectPolicy } from '../decorators/inject-policy.decorator';
import { policyITestPlugin } from '../testing';

@Injectable()
class SomePolicy implements IPolicy<void> {
  verify(): Promise<boolean> {
    return Promise.resolve(true);
  }
}

@Injectable()
class UseThisPolicy implements IPolicy<void> {
  verify(): Promise<boolean> {
    return Promise.resolve(false);
  }
}

@Injectable()
class OtherPolicy implements IPolicy<void> {
  verify(): Promise<boolean> {
    return Promise.resolve(false);
  }
}

@Injectable()
class ToOverwritePolicy implements IPolicy<void> {
  verify(): Promise<boolean> {
    return Promise.resolve(false);
  }
}

@LyvelyModule({
  id: 'policy-test',
  name: 'PolicyTest',
  path: __dirname,
  policies: [{ provide: SomePolicy, useClass: UseThisPolicy }, OtherPolicy, ToOverwritePolicy],
})
class PolicyTestModule {}

@Injectable()
class PolicyTestService {
  @InjectPolicy(SomePolicy.name)
  public policy: IPolicy<void>;

  @InjectPolicy(OtherPolicy.name)
  public otherPolicy: IPolicy<void>;

  @InjectPolicy(ToOverwritePolicy.name)
  public toOverwritePolicy: IPolicy<void>;
}

describe('PolicyRegistry', () => {
  let testingModule: ILyvelyTestingModule;
  let testService: PolicyTestService;

  const TEST_KEY = 'PolicyRegistry';

  usePolicyRegistry().registerType(SomePolicy, ToOverwritePolicy);

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([policyITestPlugin])
      .providers([PolicyTestService])
      .imports([PolicyTestModule])
      .compile();

    testService = testingModule.get(PolicyTestService);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  it('Make sure we use the policy defined in the registry', async () => {
    expect(testService.policy instanceof UseThisPolicy).toEqual(true);
    expect(await testService.policy.verify()).toEqual(false);
  });

  it('Test policy type only provider', async () => {
    expect(testService.otherPolicy instanceof OtherPolicy).toEqual(true);
  });

  it('Test overwriting of a policy works', async () => {
    expect(testService.toOverwritePolicy instanceof SomePolicy).toEqual(true);
  });
});
