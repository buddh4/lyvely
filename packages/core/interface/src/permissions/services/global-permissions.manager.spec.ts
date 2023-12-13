import {
  BasePermissionType,
  clearPermissions,
  GlobalPermissionRole,
  IGlobalPermissionObject,
  IPermission,
  IPermissionConfig,
  registerPermissions,
  useGlobalPermissionsManager,
} from '../../permissions';
import { IntegrityException } from '../../exceptions';
import { UserStatus, VisitorMode } from '../../users';
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
        min: GlobalPermissionRole.Admin,
        max: GlobalPermissionRole.Moderator,
        default: GlobalPermissionRole.Moderator,
        type: BasePermissionType.Global,
        ...data,
      },
    ]);
  };

  const verifyTestPermission = (
    role: GlobalPermissionRole,
    settings?: IGlobalPermissionObject | null,
    options?: {
      config?: IPermissionConfig;
      userStatus?: UserStatus;
      relationStatus?: UserStatus;
      groups?: string[];
    },
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
      options?.config || { visitorStrategy: { mode: VisitorMode.Disabled } },
    );
  };

  it('profile permission defaults', () => {
    registerTestPermission({
      min: GlobalPermissionRole.Admin,
      max: GlobalPermissionRole.Moderator,
      default: GlobalPermissionRole.Moderator,
    });

    expect(verifyTestPermission(GlobalPermissionRole.Admin)).toEqual(true);
    expect(verifyTestPermission(GlobalPermissionRole.Moderator)).toEqual(true);
    expect(verifyTestPermission(GlobalPermissionRole.User)).toEqual(false);
    expect(verifyTestPermission(GlobalPermissionRole.Visitor)).toEqual(false);
  });

  it('assure min role is respected', () => {
    registerTestPermission({
      min: GlobalPermissionRole.Moderator,
    });

    const settings: IGlobalPermissionObject = {
      getPermissionSettings: () => [{ id: 'test', role: GlobalPermissionRole.Admin }],
      getPermissionGroups: () => [],
    };

    expect(verifyTestPermission(GlobalPermissionRole.Admin, settings)).toEqual(true);
    expect(verifyTestPermission(GlobalPermissionRole.Moderator, settings)).toEqual(true);
    expect(verifyTestPermission(GlobalPermissionRole.User, settings)).toEqual(false);
    expect(verifyTestPermission(GlobalPermissionRole.Visitor, settings)).toEqual(false);
  });

  it('assure max role is respected', () => {
    registerTestPermission({
      max: GlobalPermissionRole.Moderator,
    });

    const settings: IGlobalPermissionObject = {
      getPermissionSettings: () => [{ id: 'test', role: GlobalPermissionRole.User }],
      getPermissionGroups: () => [],
    };

    expect(verifyTestPermission(GlobalPermissionRole.Admin, settings)).toEqual(true);
    expect(verifyTestPermission(GlobalPermissionRole.Moderator, settings)).toEqual(true);
    expect(verifyTestPermission(GlobalPermissionRole.User, settings)).toEqual(false);
    expect(verifyTestPermission(GlobalPermissionRole.Visitor, settings)).toEqual(false);
  });

  it('profile permission overwritten by profile settings', () => {
    registerTestPermission({
      default: GlobalPermissionRole.Moderator,
    });

    const settings: IGlobalPermissionObject = {
      getPermissionSettings: () => [{ id: 'test', role: GlobalPermissionRole.Admin }],
      getPermissionGroups: () => [],
    };

    expect(verifyTestPermission(GlobalPermissionRole.Admin, settings)).toEqual(true);
    expect(verifyTestPermission(GlobalPermissionRole.Moderator, settings)).toEqual(false);
    expect(verifyTestPermission(GlobalPermissionRole.User, settings)).toEqual(false);
    expect(verifyTestPermission(GlobalPermissionRole.Visitor, settings)).toEqual(false);
  });

  it('profile permission overwritten by configuration', () => {
    registerTestPermission({
      default: GlobalPermissionRole.Moderator,
    });

    const config: IPermissionConfig = {
      defaults: [{ id: 'test', role: GlobalPermissionRole.Admin }],
      visitorStrategy: { mode: VisitorMode.Disabled },
    };

    expect(verifyTestPermission(GlobalPermissionRole.Admin, null, { config })).toEqual(true);
    expect(verifyTestPermission(GlobalPermissionRole.Moderator, null, { config })).toEqual(false);
    expect(verifyTestPermission(GlobalPermissionRole.User, null, { config })).toEqual(false);
    expect(verifyTestPermission(GlobalPermissionRole.Visitor, null, { config })).toEqual(false);
  });

  it('do not allow visitors if not configured', () => {
    registerTestPermission({
      max: GlobalPermissionRole.Visitor,
      default: GlobalPermissionRole.Visitor,
    });

    const config: IPermissionConfig = {
      visitorStrategy: { mode: VisitorMode.Disabled },
    };

    expect(verifyTestPermission(GlobalPermissionRole.Admin, null, { config })).toEqual(true);
    expect(verifyTestPermission(GlobalPermissionRole.Moderator, null, { config })).toEqual(true);
    expect(verifyTestPermission(GlobalPermissionRole.User, null, { config })).toEqual(true);
    expect(verifyTestPermission(GlobalPermissionRole.Visitor, null, { config })).toEqual(false);
  });

  it('allow visitors if configured', () => {
    registerTestPermission({
      max: GlobalPermissionRole.Visitor,
      default: GlobalPermissionRole.Visitor,
    });

    const config: IPermissionConfig = {
      visitorStrategy: { mode: VisitorMode.Enabled, handles: [''] },
    };

    expect(verifyTestPermission(GlobalPermissionRole.Admin, null, { config })).toEqual(true);
    expect(verifyTestPermission(GlobalPermissionRole.Moderator, null, { config })).toEqual(true);
    expect(verifyTestPermission(GlobalPermissionRole.User, null, { config })).toEqual(true);
    expect(verifyTestPermission(GlobalPermissionRole.Visitor, null, { config })).toEqual(true);
  });

  it('invalid permission default will fallback to max', () => {
    registerTestPermission({
      min: GlobalPermissionRole.Admin,
      max: GlobalPermissionRole.Moderator,
      default: ProfileRelationRole.User,
    });

    expect(verifyTestPermission(GlobalPermissionRole.Admin)).toEqual(true);
    expect(verifyTestPermission(GlobalPermissionRole.Moderator)).toEqual(true);
    expect(verifyTestPermission(GlobalPermissionRole.User)).toEqual(false);
    expect(verifyTestPermission(GlobalPermissionRole.Visitor)).toEqual(false);
  });

  it('invalid min/max throws error', () => {
    registerTestPermission({
      min: GlobalPermissionRole.User,
      max: GlobalPermissionRole.Admin,
    });

    expect.assertions(1);

    try {
      verifyTestPermission(GlobalPermissionRole.Admin);
    } catch (e) {
      expect(e instanceof IntegrityException).toEqual(true);
    }
  });

  it('test user access through group assignment', () => {
    registerTestPermission({
      min: GlobalPermissionRole.Moderator,
      max: GlobalPermissionRole.Moderator,
      default: GlobalPermissionRole.Moderator,
    });

    const testGroup = 'testGroup';

    const settings: IGlobalPermissionObject = {
      getPermissionSettings: () => [
        { id: 'test', role: GlobalPermissionRole.Moderator, groups: [testGroup] },
      ],
      getPermissionGroups: () => [testGroup],
    };

    expect(
      verifyTestPermission(GlobalPermissionRole.User, settings, { groups: [testGroup] }),
    ).toEqual(true);
    expect(verifyTestPermission(GlobalPermissionRole.User, settings)).toEqual(false);
  });

  it('test non existing group will be ignored', () => {
    registerTestPermission({
      min: GlobalPermissionRole.Moderator,
      max: GlobalPermissionRole.Moderator,
      default: GlobalPermissionRole.Moderator,
    });

    const testGroup = 'testGroup';

    const settings: IGlobalPermissionObject = {
      getPermissionSettings: () => [
        { id: 'test', role: GlobalPermissionRole.Moderator, groups: [testGroup] },
      ],
      getPermissionGroups: () => [],
    };

    expect(
      verifyTestPermission(GlobalPermissionRole.User, settings, { groups: [testGroup] }),
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
      verifyTestPermission(GlobalPermissionRole.User);
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
      verifyTestPermission(GlobalPermissionRole.User);
    } catch (e) {
      expect(e instanceof IntegrityException).toEqual(true);
    }
  });
});
