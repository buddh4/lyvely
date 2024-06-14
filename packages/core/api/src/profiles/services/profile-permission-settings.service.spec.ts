import { getObjectId, ILyvelyTestingModule } from '@/testing';
import {
  ProfileMemberGroup,
  ProfilePermissionSettingsService,
  ProfileTestDataUtils,
  buildProfileTest,
} from '../index';
import {
  BasePermissionType,
  clearPermissions,
  FieldValidationException,
  IProfilePermission,
  ProfileRelationRole,
  ProfileVisibilityLevel,
  registerPermissions,
} from '@lyvely/interface';

describe('ProfilePermissionsService', () => {
  let testingModule: ILyvelyTestingModule;
  let testDataUtils: ProfileTestDataUtils;
  let permissionSettingsService: ProfilePermissionSettingsService;

  const TEST_KEY = 'profile_permissions_service';

  beforeEach(async () => {
    testingModule = await buildProfileTest(TEST_KEY).compile();
    permissionSettingsService = testingModule.get(ProfilePermissionSettingsService);
    testDataUtils = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    clearPermissions();
    return testingModule.afterEach();
  });

  function registerTestPermission(data?: Partial<IProfilePermission>) {
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
        ...data,
      },
    ]);
  }

  describe('setPermission', () => {
    it('user can overwrite default permission', async () => {
      const { profile } = await testDataUtils.createUserAndProfile();
      registerTestPermission({ default: ProfileRelationRole.Moderator });

      const update = await permissionSettingsService.setPermission(profile, {
        id: 'test1',
        role: ProfileRelationRole.Member,
      });

      expect(profile.permissions.length).toEqual(1);
      expect(profile.permissions[0]).toEqual({
        id: 'test1',
        role: ProfileRelationRole.Member,
      });
      expect(update).toEqual(profile.permissions[0]);
    });

    it('min permission level is respected', async () => {
      const { profile } = await testDataUtils.createUserAndProfile();
      registerTestPermission({ min: ProfileRelationRole.Admin });

      expect.assertions(2);

      try {
        await permissionSettingsService.setPermission(profile, {
          id: 'test1',
          role: ProfileRelationRole.Owner,
        });
      } catch (e) {
        expect(e instanceof FieldValidationException).toEqual(true);
        expect((<any>e).data.fields[0].errors).toEqual(['min']);
      }
    });

    it('max permission level is respected', async () => {
      const { profile } = await testDataUtils.createUserAndProfile();
      registerTestPermission({ max: ProfileRelationRole.Member });

      expect.assertions(2);

      try {
        await permissionSettingsService.setPermission(profile, {
          id: 'test1',
          role: ProfileRelationRole.User,
        });
      } catch (e) {
        expect(e instanceof FieldValidationException).toEqual(true);
        expect((<any>e).data.fields[0].errors).toEqual(['max']);
      }
    });

    it('profile visibility is respected', async () => {
      const { profile } = await testDataUtils.createUserAndProfile();
      profile.visibility = ProfileVisibilityLevel.Member;

      registerTestPermission({ max: ProfileRelationRole.User });

      try {
        await permissionSettingsService.setPermission(profile, {
          id: 'test1',
          role: ProfileRelationRole.User,
        });
      } catch (e) {
        expect(e instanceof FieldValidationException).toEqual(true);
        expect((<any>e).data.fields[0].errors).toEqual(['max']);
      }
    });

    it('invalid permission type throws error', async () => {
      const { profile } = await testDataUtils.createUserAndProfile();
      registerTestPermission({ type: <any>BasePermissionType.User });

      expect.assertions(2);

      try {
        await permissionSettingsService.setPermission(profile, {
          id: 'test1',
          role: ProfileRelationRole.Member,
        });
      } catch (e) {
        expect(e instanceof FieldValidationException).toEqual(true);
        expect((<any>e).data.fields[0].property).toEqual('id');
      }
    });

    it('non existing group is ignored', async () => {
      registerTestPermission();
      const { profile } = await testDataUtils.createUserAndProfile();
      profile.groups = [
        new ProfileMemberGroup(<ProfileMemberGroup>{
          _id: getObjectId('test-protected-group'),
          id: getObjectId('test-protected-group').toString(),
          name: 'TestGroup',
        }),
      ];

      const update = await permissionSettingsService.setPermission(profile, {
        id: 'test1',
        role: ProfileRelationRole.Member,
        groups: [getObjectId('test-protected-group'), getObjectId('another-group')],
      });

      expect(profile.permissions.length).toEqual(1);
      expect(profile.permissions[0]).toEqual({
        id: 'test1',
        role: ProfileRelationRole.Member,
        groups: [getObjectId('test-protected-group')],
      });
      expect(update).toEqual(profile.permissions[0]);
    });
  });
});
