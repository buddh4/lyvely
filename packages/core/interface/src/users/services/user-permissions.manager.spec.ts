import {
  BasePermissionType,
  clearPermissions,
  IPermission,
  IPermissionConfig,
  VisitorMode,
  registerPermissions,
} from '../../permissions';
import { UserRelationRole } from '../interfaces';
import { IntegrityException } from '../../exceptions';
import { UserModel, UserStatus  } from '../../users';
import { useUserRelationPermissionsManager } from './user-permissions.manager';
import { ProfileRelationRole } from '../../profiles';

describe('UserPermissionsService', function () {
  afterEach(clearPermissions);

  const service = useUserRelationPermissionsManager();

  const registerTestPermission = (data?: Partial<IPermission<any, any>>) => {
    registerPermissions([
      {
        id: 'test',
        name: 'Test',
        description: 'Test',
        moduleId: 'test',
        min: UserRelationRole.Friend,
        max: UserRelationRole.User,
        default: UserRelationRole.Contact,
        type: BasePermissionType.User,
        ...data,
      },
    ]);
  };

  const verifyTestPermission = (
    role: UserRelationRole,
    user?: UserModel | null,
    options?: {
      config?: IPermissionConfig;
      userStatus?: UserStatus;
      relationStatus?: UserStatus;
      groups?: string[];
    }
  ) => {
    user ||= new UserModel({} as any);
    return service.verifyPermission(
      'test',
      {
        role: role,
        userStatus: options?.userStatus ?? UserStatus.Active,
        relationStatus: options?.relationStatus ?? UserStatus.Active,
        groups: options?.groups || [],
      },
      user,
      options?.config ? { ...options.config, featureConfig: {} } : { visitorStrategy: { mode: VisitorMode.Disabled }, featureConfig: {} }
    );
  };

  it('profile permission defaults', () => {
    registerTestPermission({
      min: UserRelationRole.Friend,
      max: UserRelationRole.User,
      default: UserRelationRole.Contact,
    });

    expect(verifyTestPermission(UserRelationRole.Owner)).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Friend)).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Contact)).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Follower)).toEqual(false);
    expect(verifyTestPermission(UserRelationRole.User)).toEqual(false);
    expect(verifyTestPermission(UserRelationRole.Visitor)).toEqual(false);
  });

  it('assure min role is respected', () => {
    registerTestPermission({
      min: UserRelationRole.Friend,
    });

    const user = new UserModel({
      permissions: [{ id: 'test', role: UserRelationRole.Owner }],
    });

    expect(verifyTestPermission(UserRelationRole.Owner, user)).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Friend, user)).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Contact, user)).toEqual(false);
    expect(verifyTestPermission(UserRelationRole.Follower, user)).toEqual(false);
    expect(verifyTestPermission(UserRelationRole.User, user)).toEqual(false);
    expect(verifyTestPermission(UserRelationRole.Visitor, user)).toEqual(false);
  });

  it('assure max role is respected', () => {
    registerTestPermission({
      max: UserRelationRole.Contact,
    });

    const user = new UserModel({
      permissions: [{ id: 'test', role: UserRelationRole.User }],
    });

    expect(verifyTestPermission(UserRelationRole.Owner, user)).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Friend, user)).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Contact, user)).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Follower, user)).toEqual(false);
    expect(verifyTestPermission(UserRelationRole.User, user)).toEqual(false);
    expect(verifyTestPermission(UserRelationRole.Visitor, user)).toEqual(false);
  });

  it('profile permission overwritten by profile settings', () => {
    registerTestPermission({ default: UserRelationRole.Friend });

    const user = new UserModel({
      permissions: [{ id: 'test', role: UserRelationRole.Contact }],
    });

    expect(verifyTestPermission(UserRelationRole.Owner, user)).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Friend, user)).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Contact, user)).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Follower, user)).toEqual(false);
    expect(verifyTestPermission(UserRelationRole.User, user)).toEqual(false);
    expect(verifyTestPermission(UserRelationRole.Visitor, user)).toEqual(false);
  });

  it('profile permission overwritten by configuration', () => {
    registerTestPermission({ default: UserRelationRole.Friend });

    const config: IPermissionConfig = {
      defaults: [{ id: 'test', role: UserRelationRole.Contact }],
      visitorStrategy: { mode: VisitorMode.Disabled },
    };

    expect(verifyTestPermission(UserRelationRole.Owner, null, { config })).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Friend, null, { config })).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Contact, null, { config })).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Follower, null, { config })).toEqual(false);
    expect(verifyTestPermission(UserRelationRole.User, null, { config })).toEqual(false);
    expect(verifyTestPermission(UserRelationRole.Visitor, null, { config })).toEqual(false);
  });

  it('do not allow visitors if not configured', () => {
    registerTestPermission({
      max: UserRelationRole.Visitor,
      default: UserRelationRole.Visitor,
    });

    const config: IPermissionConfig = {
      visitorStrategy: { mode: VisitorMode.Disabled },
    };

    expect(verifyTestPermission(UserRelationRole.Owner, null, { config })).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Friend, null, { config })).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Contact, null, { config })).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Follower, null, { config })).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.User, null, { config })).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Visitor, null, { config })).toEqual(false);
  });

  it('allow visitors if configured', () => {
    registerTestPermission({
      max: UserRelationRole.Visitor,
      default: UserRelationRole.Visitor,
    });

    const config: IPermissionConfig = {
      visitorStrategy: { mode: VisitorMode.Enabled, handles: [''] },
    };

    expect(verifyTestPermission(UserRelationRole.Owner, null, { config })).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Friend, null, { config })).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Contact, null, { config })).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Follower, null, { config })).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.User, null, { config })).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Visitor, null, { config })).toEqual(true);
  });

  it('invalid permission default will fallback to max', () => {
    registerTestPermission({
      min: UserRelationRole.Friend,
      max: UserRelationRole.Contact,
      default: ProfileRelationRole.User,
    });

    expect(verifyTestPermission(UserRelationRole.Owner)).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Friend)).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Contact)).toEqual(true);
    expect(verifyTestPermission(UserRelationRole.Follower)).toEqual(false);
    expect(verifyTestPermission(UserRelationRole.User)).toEqual(false);
    expect(verifyTestPermission(UserRelationRole.Visitor)).toEqual(false);
  });

  it('invalid min/max throws error', () => {
    registerTestPermission({
      min: UserRelationRole.User,
      max: UserRelationRole.Friend,
    });

    expect.assertions(1);

    try {
      verifyTestPermission(UserRelationRole.Owner);
    } catch (e) {
      expect(e instanceof IntegrityException).toEqual(true);
    }
  });

  it('test user access through group assignment', () => {
    registerTestPermission({
      min: UserRelationRole.Friend,
      max: UserRelationRole.Friend,
      default: UserRelationRole.Friend,
    });

    const testGroup = 'testGroup';

    const user = new UserModel({
      permissions: [{ id: 'test', role: UserRelationRole.Friend, groups: [testGroup] }],
      groups: [{ id: testGroup, name: testGroup }],
    });

    expect(verifyTestPermission(UserRelationRole.Contact, user, { groups: [testGroup] })).toEqual(
      true
    );
    expect(verifyTestPermission(UserRelationRole.Contact, user)).toEqual(false);
  });

  it('test non existing roup will be ignored', () => {
    registerTestPermission({
      min: UserRelationRole.Friend,
      max: UserRelationRole.Friend,
      default: UserRelationRole.Friend,
    });

    const testGroup = 'testGroup';

    const user = new UserModel({
      permissions: [{ id: 'test', role: UserRelationRole.Friend, groups: [testGroup] }],
      groups: [],
    });

    expect(verifyTestPermission(UserRelationRole.Contact, user, { groups: [testGroup] })).toEqual(
      false
    );
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
      verifyTestPermission(UserRelationRole.User);
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
      verifyTestPermission(UserRelationRole.User);
    } catch (e) {
      expect(e instanceof IntegrityException).toEqual(true);
    }
  });
});
