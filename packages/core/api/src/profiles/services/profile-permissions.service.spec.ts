import { buildTest, LyvelyTestingModule } from '@/testing';
import {
  Membership,
  ProfileContext,
  ProfilePermissionsService,
  ProfileRolePermission,
  profilesTestPlugin,
  ProfileTestDataUtils,
  ProfileUserContext,
  ProfileVisibilityLevel,
  TOKEN_DEFAULT_PROFILE_PERMISSIONS,
  TOKEN_PROFILE_ROLES_DEFINITION,
} from '../index';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import {
  BaseMembershipRole,
  BaseProfileRelationRole,
  RoleVisibilityLevel,
} from '@lyvely/core-interface';

describe('ProfilePermissionsService', () => {
  let testingModule: LyvelyTestingModule;
  let testDataUtils: ProfileTestDataUtils;
  let permissionsService: ProfilePermissionsService;

  const rolesDefinitionProvider = {
    provide: TOKEN_PROFILE_ROLES_DEFINITION,
    useFactory: () => [
      {
        role: BaseProfileRelationRole.Owner,
        label: 'Owner',
        visibility: RoleVisibilityLevel.Owner,
      },
      {
        role: BaseProfileRelationRole.Admin,
        label: 'Admin',
        visibility: RoleVisibilityLevel.Admin,
        assignable: true,
        extendable: true,
      },
      {
        extends: BaseProfileRelationRole.Admin,
        role: 'UserManager',
        label: 'User Manager',
        visibility: RoleVisibilityLevel.Admin,
        assignable: true,
        extendable: true,
      },
      {
        role: 'moderator',
        label: 'Moderator',
        visibility: RoleVisibilityLevel.Moderator,
        assignable: true,
        extendable: true,
      },
      {
        extends: BaseProfileRelationRole.Moderator,
        role: 'newsbot',
        label: 'NewsBot',
        visibility: RoleVisibilityLevel.Moderator,
        assignable: false,
      },
      {
        role: BaseProfileRelationRole.Member,
        label: 'Member',
        visibility: RoleVisibilityLevel.Member,
        assignable: true,
        extendable: true,
      },
      {
        extends: BaseProfileRelationRole.Member,
        role: 'newbie',
        label: 'NewMember',
        visibility: RoleVisibilityLevel.Member,
      },
      {
        role: BaseProfileRelationRole.Follower,
        label: 'Follower',
        visibility: RoleVisibilityLevel.User,
      },
      {
        role: BaseProfileRelationRole.Guest,
        label: 'Guest',
        visibility: RoleVisibilityLevel.Guest,
      },
      {
        role: BaseProfileRelationRole.Organization,
        label: 'Organization Member',
        visibility: RoleVisibilityLevel.Organization,
        assignable: true,
        extendable: true,
      },
      {
        role: BaseProfileRelationRole.User,
        label: 'User',
        visibility: RoleVisibilityLevel.User,
      },
      {
        role: BaseProfileRelationRole.Visitor,
        label: 'Visitor',
        visibility: RoleVisibilityLevel.Visitor,
      },
    ],
  };

  const defaultPermissionsProvider = {
    provide: TOKEN_DEFAULT_PROFILE_PERMISSIONS,
    useFactory: () => ({
      'test.*': BaseProfileRelationRole.Admin,
      'test.administrate': BaseProfileRelationRole.Moderator,
      'moderate.*': BaseProfileRelationRole.Moderator,
    }),
  };

  class PermissionConfigModule {
    static register(): DynamicModule {
      return {
        global: true,
        module: PermissionConfigModule,
        providers: [rolesDefinitionProvider, defaultPermissionsProvider],
        exports: [rolesDefinitionProvider, defaultPermissionsProvider],
      };
    }
  }

  const TEST_KEY = 'profile_permissions_service';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([profilesTestPlugin])
      .imports([PermissionConfigModule.register()])
      .compile();
    permissionsService = testingModule.get<ProfilePermissionsService>(ProfilePermissionsService);
    testDataUtils = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  // TODO: Seperate between default permission tests and configured permission test

  async function createMembership(role: BaseProfileRelationRole) {
    const { user, profile } = await testDataUtils.createUserAndProfile();
    const context = new ProfileUserContext({
      user,
      profile,
      relations: [Membership.create({ user, profile, role: role })],
    });

    return { owner: user, profile, context };
  }
  describe('default permissions', () => {
    it('admin inherits configured default moderator permission', async () => {
      const { context } = await createMembership(BaseProfileRelationRole.Admin);
      const result = await permissionsService.checkPermission(context, 'moderate.announce');
      expect(result).toEqual(true);
    });

    it('default permission for member matches', async () => {
      const { context } = await createMembership(BaseProfileRelationRole.Member);

      permissionsService.registerDefaultPermissions([
        { role: BaseMembershipRole.Member, permission: 'special.write' },
      ]);

      const result = await permissionsService.checkPermission(context, 'special.write');
      expect(result).toEqual(true);
    });

    it('member does not inherit default admin permissions', async () => {
      const { context } = await createMembership(BaseProfileRelationRole.Member);

      permissionsService.registerDefaultPermissions([
        { role: BaseMembershipRole.Admin, permission: 'special.write' },
      ]);

      const result = await permissionsService.checkPermission(context, 'special.write');
      expect(result).toEqual(false);
    });

    it('admin inherits default member permissions', async () => {
      const { context } = await createMembership(BaseProfileRelationRole.Admin);

      permissionsService.registerDefaultPermissions([
        { role: BaseMembershipRole.Member, permission: 'special.write' },
      ]);

      const result = await permissionsService.checkPermission(context, 'special.write');
      expect(result).toEqual(true);
    });

    it('member inherits default permission from visitor role', async () => {
      const { context } = await createMembership(BaseProfileRelationRole.Member);

      permissionsService.registerDefaultPermissions([
        { role: BaseProfileRelationRole.Visitor, permission: 'special.write' },
      ]);

      const result = await permissionsService.checkPermission(context, 'special.write');
      expect(result).toEqual(true);
    });

    it('default permission pattern matches specific permission', async () => {
      const { context } = await createMembership(BaseProfileRelationRole.Member);

      permissionsService.registerDefaultPermissions([
        { role: BaseProfileRelationRole.Member, permission: 'special.*' },
      ]);

      const result = await permissionsService.checkPermission(context, 'special.write');
      expect(result).toEqual(true);
    });

    it('default permission pattern matches specific permission with 3 levels', async () => {
      const { context } = await createMembership(BaseProfileRelationRole.Member);

      permissionsService.registerDefaultPermissions([
        { role: BaseProfileRelationRole.Member, permission: 'special.*' },
      ]);

      const result = await permissionsService.checkPermission(context, 'special.major.write');
      expect(result).toEqual(true);
    });

    it('default permission pattern matches pattern permission with 3 levels', async () => {
      const { context } = await createMembership(BaseProfileRelationRole.Member);

      permissionsService.registerDefaultPermissions([
        { role: BaseProfileRelationRole.Member, permission: 'special.*' },
      ]);

      const result = await permissionsService.checkPermission(context, 'special.*.write');
      expect(result).toEqual(true);
    });

    it('specific default permission does not match pattern permission', async () => {
      const { context } = await createMembership(BaseProfileRelationRole.Member);

      permissionsService.registerDefaultPermissions([
        { role: BaseProfileRelationRole.Member, permission: 'special.write' },
      ]);

      const result = await permissionsService.checkPermission(context, 'special.*');
      expect(result).toEqual(false);
    });
  });

  describe('checkPermissionByUserRelation', () => {
    it('owner has all permissions', async () => {
      const { context } = await createMembership(BaseProfileRelationRole.Owner);
      const result = await permissionsService.checkPermission(context, '*');
      expect(result).toEqual(true);
    });

    it('member does not have all permissions', async () => {
      const { context } = await createMembership(BaseProfileRelationRole.Member);
      const result = await permissionsService.checkPermission(context, '*');
      expect(result).toEqual(false);
    });

    it('member has configured permission', async () => {
      const { profile, context } = await createMembership(BaseProfileRelationRole.Member);
      profile.permissions = [
        new ProfileRolePermission({ role: BaseMembershipRole.Member, permission: 'special.write' }),
      ];
      const result = await permissionsService.checkPermission(context, 'special.write');
      expect(result).toEqual(true);
    });

    it('member permission check without default fails', async () => {
      const { context } = await createMembership(BaseProfileRelationRole.Member);
      const result = await permissionsService.checkPermission(context, 'special.write');
      expect(result).toEqual(false);
    });

    it('check result of unknown role', async () => {
      const { context } = await createMembership(<any>'role_which_does_not_exist');
      const result = await permissionsService.checkPermission(context, 'special.*');
      expect(result).toEqual(false);
    });
  });

  describe('getVisibilityLevel', () => {
    it('get owner level', async () => {
      const { context } = await createMembership(BaseProfileRelationRole.Owner);
      const result = permissionsService.getVisibilityLevel(context);
      expect(result).toEqual(RoleVisibilityLevel.Owner);
    });
    it('get admin level', async () => {
      const { context } = await createMembership(BaseProfileRelationRole.Admin);
      const result = permissionsService.getVisibilityLevel(context);
      expect(result).toEqual(RoleVisibilityLevel.Admin);
    });
    it('get moderator level', async () => {
      const { context } = await createMembership(BaseProfileRelationRole.Moderator);
      const result = permissionsService.getVisibilityLevel(context);
      expect(result).toEqual(RoleVisibilityLevel.Moderator);
    });
    it('get moderator level', async () => {
      const { context } = await createMembership(BaseProfileRelationRole.Member);
      const result = permissionsService.getVisibilityLevel(context);
      expect(result).toEqual(RoleVisibilityLevel.Member);
    });
    it('get guest level', async () => {
      const { context } = await createMembership(BaseProfileRelationRole.Guest);
      const result = permissionsService.getVisibilityLevel(context);
      expect(result).toEqual(RoleVisibilityLevel.Guest);
    });
    it('get organization level', async () => {
      const { owner, member, organization } = await testDataUtils.createSimpleOrganization();

      const { memberContext } = await testDataUtils.createSimpleGroup(
        ProfileVisibilityLevel.Organization,
        {},
        organization,
        owner,
        member,
      );

      // Remove membership
      memberContext.relations = [];

      const result = permissionsService.getVisibilityLevel(memberContext);
      expect(result).toEqual(RoleVisibilityLevel.Organization);
    });
    it('get user level', async () => {
      const user = await testDataUtils.createUser();
      const { profile } = await testDataUtils.createSimpleGroup();

      const userContext = new ProfileUserContext({
        user,
        profile,
        relations: [],
      });

      const result = permissionsService.getVisibilityLevel(userContext);
      expect(result).toEqual(RoleVisibilityLevel.User);
    });

    it('get visitor level', async () => {
      const { profile } = await testDataUtils.createSimpleGroup();

      const userContext = new ProfileContext({
        profile,
        relations: [],
      });

      const result = permissionsService.getVisibilityLevel(userContext);
      expect(result).toEqual(RoleVisibilityLevel.Visitor);
    });
  });
});
