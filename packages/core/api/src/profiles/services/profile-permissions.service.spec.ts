import { buildTest, LyvelyTestingModule } from '@/testing';
import { ProfilePermissionsService, profilesTestPlugin, ProfileTestDataUtils } from '../index';
import { ProfileMembershipRole, ProfileRelationRole } from '@lyvely/core-interface';

describe('ProfilePermissionsService', () => {
  let testingModule: LyvelyTestingModule;
  let testDataUtils: ProfileTestDataUtils;
  let permissionsService: ProfilePermissionsService;

  const TEST_KEY = 'profile_permissions_service';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY).plugins([profilesTestPlugin]).compile();
    permissionsService = testingModule.get<ProfilePermissionsService>(ProfilePermissionsService);
    testDataUtils = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  describe('default permissions', () => {
    it('admin inherits configured default moderator permission', async () => {
      /* const { context } = await createMembership(ProfileRelationRole.Admin);
      const result = await permissionsService.checkPermission(context, 'moderate.announce');
      expect(result).toEqual(true);*/
    });
  });
});
