import {
  BasePermissionType,
  clearPermissions,
  IGlobalPermissionObject,
  IPermission,
  IPermissionConfig,
  registerPermissions,
  VisitorMode,
  useGlobalPermissionsManager,
  UserRole
} from '../../permissions';
import { IntegrityException } from '../../exceptions';
import { UserStatus, } from '../../users';
import { ProfileRelationRole } from '../../profiles';

describe('GlobalPermissionsManager', function () {
  afterEach(clearPermissions);

  const manager = useGlobalPermissionsManager();

  const registerTestPermission = (data?: Partial<IPermission<any, any>>) => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        name: 'test',
        description: 'test',
        min: UserRole.Admin,
        max: UserRole.Moderator,
        default: UserRole.Moderator,
        type: BasePermissionType.Global,
        ...data,
      },
    ]);
  };

  const verifyTestPermission = (
    role: UserRole,
    settings?: IGlobalPermissionObject | null,
    options?: {
      config?: IPermissionConfig;
      userStatus?: UserStatus;
      relationStatus?: UserStatus;
      groups?: string[];
    }
  ) => {
    settings ||= {
      getPermissionGroups: () => [],
      getPermissionSettings: () => [],
    };
    return manager.verifyPermission(
      'test',
      {
        role: role,
        userStatus: options?.userStatus ?? UserStatus.Active,
        relationStatus: options?.relationStatus ?? UserStatus.Active,
        groups: options?.groups || [],
      },
      settings,
      options?.config ? { ...options.config, featureConfig: {} } : { visitorStrategy: { mode: VisitorMode.Disabled }, featureConfig: {} }
    );
  };

  it('profile permission defaults', () => {
    registerTestPermission({
      min: UserRole.Admin,
      max: UserRole.Moderator,
      default: UserRole.Moderator,
    });

    expect(verifyTestPermission(UserRole.Admin)).toEqual(true);
    expect(verifyTestPermission(UserRole.Moderator)).toEqual(true);
    expect(verifyTestPermission(UserRole.User)).toEqual(false);
    expect(verifyTestPermission(UserRole.Visitor)).toEqual(false);
  });

  it('assure min role is respected', () => {
    registerTestPermission({
      min: UserRole.Moderator,
    });

    const settings: IGlobalPermissionObject = {
      getPermissionSettings: () => [{ id: 'test', role: UserRole.Admin }],
      getPermissionGroups: () => [],
    };

    expect(verifyTestPermission(UserRole.Admin, settings)).toEqual(true);
    expect(verifyTestPermission(UserRole.Moderator, settings)).toEqual(true);
    expect(verifyTestPermission(UserRole.User, settings)).toEqual(false);
    expect(verifyTestPermission(UserRole.Visitor, settings)).toEqual(false);
  });

  it('assure max role is respected', () => {
    registerTestPermission({
      max: UserRole.Moderator,
    });

    const settings: IGlobalPermissionObject = {
      getPermissionSettings: () => [{ id: 'test', role: UserRole.User }],
      getPermissionGroups: () => [],
    };

    expect(verifyTestPermission(UserRole.Admin, settings)).toEqual(true);
    expect(verifyTestPermission(UserRole.Moderator, settings)).toEqual(true);
    expect(verifyTestPermission(UserRole.User, settings)).toEqual(false);
    expect(verifyTestPermission(UserRole.Visitor, settings)).toEqual(false);
  });

  it('profile permission overwritten by profile settings', () => {
    registerTestPermission({
      default: UserRole.Moderator,
    });

    const settings: IGlobalPermissionObject = {
      getPermissionSettings: () => [{ id: 'test', role: UserRole.Admin }],
      getPermissionGroups: () => [],
    };

    expect(verifyTestPermission(UserRole.Admin, settings)).toEqual(true);
    expect(verifyTestPermission(UserRole.Moderator, settings)).toEqual(false);
    expect(verifyTestPermission(UserRole.User, settings)).toEqual(false);
    expect(verifyTestPermission(UserRole.Visitor, settings)).toEqual(false);
  });

  it('profile permission overwritten by configuration', () => {
    registerTestPermission({
      default: UserRole.Moderator,
    });

    const config: IPermissionConfig = {
      defaults: [{ id: 'test', role: UserRole.Admin }],
      visitorStrategy: { mode: VisitorMode.Disabled },
    };

    expect(verifyTestPermission(UserRole.Admin, null, { config })).toEqual(true);
    expect(verifyTestPermission(UserRole.Moderator, null, { config })).toEqual(false);
    expect(verifyTestPermission(UserRole.User, null, { config })).toEqual(false);
    expect(verifyTestPermission(UserRole.Visitor, null, { config })).toEqual(false);
  });

  it('do not allow visitors if not configured', () => {
    registerTestPermission({
      max: UserRole.Visitor,
      default: UserRole.Visitor,
    });

    const config: IPermissionConfig = {
      visitorStrategy: { mode: VisitorMode.Disabled },
    };

    expect(verifyTestPermission(UserRole.Admin, null, { config })).toEqual(true);
    expect(verifyTestPermission(UserRole.Moderator, null, { config })).toEqual(true);
    expect(verifyTestPermission(UserRole.User, null, { config })).toEqual(true);
    expect(verifyTestPermission(UserRole.Visitor, null, { config })).toEqual(false);
  });

  it('allow visitors if configured', () => {
    registerTestPermission({
      max: UserRole.Visitor,
      default: UserRole.Visitor,
    });

    const config: IPermissionConfig = {
      visitorStrategy: { mode: VisitorMode.Enabled, handles: [''] },
    };

    expect(verifyTestPermission(UserRole.Admin, null, { config })).toEqual(true);
    expect(verifyTestPermission(UserRole.Moderator, null, { config })).toEqual(true);
    expect(verifyTestPermission(UserRole.User, null, { config })).toEqual(true);
    expect(verifyTestPermission(UserRole.Visitor, null, { config })).toEqual(true);
  });

  it('invalid permission default will fallback to max', () => {
    registerTestPermission({
      min: UserRole.Admin,
      max: UserRole.Moderator,
      default: ProfileRelationRole.User,
    });

    expect(verifyTestPermission(UserRole.Admin)).toEqual(true);
    expect(verifyTestPermission(UserRole.Moderator)).toEqual(true);
    expect(verifyTestPermission(UserRole.User)).toEqual(false);
    expect(verifyTestPermission(UserRole.Visitor)).toEqual(false);
  });

  it('invalid min/max throws error', () => {
    registerTestPermission({
      min: UserRole.User,
      max: UserRole.Admin,
    });

    expect.assertions(1);

    try {
      verifyTestPermission(UserRole.Admin);
    } catch (e) {
      expect(e instanceof IntegrityException).toEqual(true);
    }
  });

  it('test user access through group assignment', () => {
    registerTestPermission({
      min: UserRole.Moderator,
      max: UserRole.Moderator,
      default: UserRole.Moderator,
    });

    const testGroup = 'testGroup';

    const settings: IGlobalPermissionObject = {
      getPermissionSettings: () => [
        { id: 'test', role: UserRole.Moderator, groups: [testGroup] },
      ],
      getPermissionGroups: () => [testGroup],
    };

    expect(
      verifyTestPermission(UserRole.User, settings, { groups: [testGroup] })
    ).toEqual(true);
    expect(verifyTestPermission(UserRole.User, settings)).toEqual(false);
  });

  it('test non existing group will be ignored', () => {
    registerTestPermission({
      min: UserRole.Moderator,
      max: UserRole.Moderator,
      default: UserRole.Moderator,
    });

    const testGroup = 'testGroup';

    const settings: IGlobalPermissionObject = {
      getPermissionSettings: () => [
        { id: 'test', role: UserRole.Moderator, groups: [testGroup] },
      ],
      getPermissionGroups: () => [],
    };

    expect(
      verifyTestPermission(UserRole.User, settings, { groups: [testGroup] })
    ).toEqual(false);
  });

  it('test circular dependency check', () => {
    registerTestPermission({
      id: 'test1',
      dependencies: ['test2'],
    });
    registerTestPermission({
      id: 'test2',
      dependencies: ['test1'],
    });

    expect.assertions(1);

    try {
      verifyTestPermission(UserRole.User);
    } catch (e) {
      expect(e instanceof IntegrityException).toEqual(true);
    }
  });

  it('test invalid permission type', () => {
    registerTestPermission({
      type: BasePermissionType.Profile,
    });

    expect.assertions(1);

    try {
      verifyTestPermission(UserRole.User);
    } catch (e) {
      expect(e instanceof IntegrityException).toEqual(true);
    }
  });
});
