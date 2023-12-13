import { buildTest, getObjectId, LyvelyTestingModule } from '@/testing';
import {
  ProfileMemberGroup,
  ProfilePermissionsService,
  profilesTestPlugin,
  ProfileTestDataUtils,
} from '@/profiles';
import {
  BasePermissionType,
  clearPermissions,
  FieldValidationException,
  IProfilePermission,
  ProfileRelationRole,
  ProfileVisibilityLevel,
  registerPermissions,
} from '@lyvely/interface';

describe('ContentPermissionsService', () => {
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

      const update = await permissionsService.setPermission(profile, {
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
        await permissionsService.setPermission(profile, {
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
        await permissionsService.setPermission(profile, {
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
        await permissionsService.setPermission(profile, {
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
        await permissionsService.setPermission(profile, {
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
        new ProfileMemberGroup({
          _id: getObjectId('test-member-group'),
          id: getObjectId('test-member-group').toString(),
          name: 'TestGroup',
        }),
      ];

      const update = await permissionsService.setPermission(profile, {
        id: 'test1',
        role: ProfileRelationRole.Member,
        groups: [getObjectId('test-member-group'), getObjectId('another-group')],
      });

      expect(profile.permissions.length).toEqual(1);
      expect(profile.permissions[0]).toEqual({
        id: 'test1',
        role: ProfileRelationRole.Member,
        groups: [getObjectId('test-member-group')],
      });
      expect(update).toEqual(profile.permissions[0]);
    });
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
