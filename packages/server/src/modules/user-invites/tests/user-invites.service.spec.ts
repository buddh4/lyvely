import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { createContentTestingModule } from '../../test/utils/test.utils';
import { TestDataUtils } from '../../test/utils/test-data.utils';

describe('RegisterService', () => {
  let testingModule: TestingModule;
  let registerService: InvitesService;
  let testData: TestDataUtils;

  const TEST_KEY = 'register_service';

  beforeEach(async () => {
    testingModule = await createContentTestingModule(TEST_KEY, [InvitesService]).compile();
    registerService = testingModule.get<InvitesService>(InvitesService);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
  });

  afterEach(async () => {
    return testData.reset(TEST_KEY);
  });

  it('should be defined', () => {
    expect(registerService).toBeDefined();
  });

  describe('register', () => {});
});
