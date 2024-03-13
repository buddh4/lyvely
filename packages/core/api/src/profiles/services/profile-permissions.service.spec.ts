import { buildTest, LyvelyTestingModule } from '@/testing';
import { ProfilePermissionsService, profilesTestPlugin, ProfileTestDataUtils } from '../index';
import {
  BasePermissionType,
  clearPermissions,
  IProfilePermission,
  ProfileRelationRole,
  registerPermissions,
} from '@lyvely/interface';

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
    clearPermissions();
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  describe('verifyEveryPermission', () => {
    it('returns true if all permissions succeed', async () => {
      const { context } = await testDataUtils.createUserAndProfile();
      registerPermissions([
        {
          id: 'test1',
          moduleId: 'test1',
          name: 'test1',
          description: 'test1',
          min: ProfileRelationRole.Admin,
          max: ProfileRelationRole.Member,
          default: ProfileRelationRole.Moderator,
          type: BasePermissionType.Profile,
        },
        {
          id: 'test2',
          moduleId: 'test2',
          name: 'test2',
          description: 'test2',
          min: ProfileRelationRole.Admin,
          max: ProfileRelationRole.Member,
          default: ProfileRelationRole.Member,
          type: BasePermissionType.Profile,
        },
      ]);
      expect(permissionsService.verifyEveryPermission(context, 'test1', 'test2')).toEqual(true);
    });

    it('returns false if any permissions fails', async () => {
      const { memberContext } = await testDataUtils.createSimpleGroup();
      registerPermissions([
        {
          id: 'test1',
          moduleId: 'test1',
          name: 'test1',
          description: 'test1',
          min: ProfileRelationRole.Admin,
          max: ProfileRelationRole.Admin,
          default: ProfileRelationRole.Admin,
          type: BasePermissionType.Profile,
        },
        {
          id: 'test2',
          moduleId: 'test2',
          name: 'test2',
          description: 'test2',
          min: ProfileRelationRole.Admin,
          max: ProfileRelationRole.Member,
          default: ProfileRelationRole.Member,
          type: BasePermissionType.Profile,
        },
      ]);
      expect(permissionsService.verifyEveryPermission(memberContext, 'test1', 'test2')).toEqual(
        false,
      );
    });
  });

  describe('verifyAnyPermission', () => {
    it('returns true if any permissions succeed', async () => {
      const { memberContext } = await testDataUtils.createSimpleGroup();
      registerPermissions([
        {
          id: 'test1',
          moduleId: 'test1',
          name: 'test1',
          description: 'test1',
          min: ProfileRelationRole.Admin,
          max: ProfileRelationRole.Admin,
          default: ProfileRelationRole.Admin,
          type: BasePermissionType.Profile,
        },
        {
          id: 'test2',
          moduleId: 'test2',
          name: 'test2',
          description: 'test2',
          min: ProfileRelationRole.Admin,
          max: ProfileRelationRole.Member,
          default: ProfileRelationRole.Member,
          type: BasePermissionType.Profile,
        },
      ]);
      expect(permissionsService.verifyAnyPermission(memberContext, 'test1', 'test2')).toEqual(true);
    });

    it('returns false if no permission succeeds', async () => {
      const { memberContext } = await testDataUtils.createSimpleGroup();
      registerPermissions([
        {
          id: 'test1',
          moduleId: 'test1',
          name: 'test1',
          description: 'test1',
          min: ProfileRelationRole.Admin,
          max: ProfileRelationRole.Admin,
          default: ProfileRelationRole.Admin,
          type: BasePermissionType.Profile,
        },
        {
          id: 'test2',
          moduleId: 'test2',
          name: 'test2',
          description: 'test2',
          min: ProfileRelationRole.Admin,
          max: ProfileRelationRole.Admin,
          default: ProfileRelationRole.Admin,
          type: BasePermissionType.Profile,
        },
      ]);
      expect(permissionsService.verifyEveryPermission(memberContext, 'test1', 'test2')).toEqual(
        false,
      );
    });
  });
});
