import {
  BasePermissionType,
  clearPermissions,
  IPermission,
  IPermissionConfig,
  VisitorMode,
  registerPermissions,
} from '../../../permissions';
import { ContentUserRole } from '../interfaces';
import { IntegrityException } from '../../../exceptions';
import { UserStatus, } from '../../../users';
import { useContentPermissionsManager } from './content-permissions.manager';
import { ProfileModel } from '../../../profiles';

describe('ContentPermissionsManager', function () {
  afterEach(clearPermissions);

  const manager = useContentPermissionsManager();

  const registerTestPermission = (data?: Partial<IPermission<any, any>>) => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        name: 'test',
        description: 'test',
        min: ContentUserRole.Admin,
        max: ContentUserRole.Member,
        default: ContentUserRole.Member,
        type: BasePermissionType.Content,
        ...data,
      },
    ]);
  };

  const verifyTestPermission = (
    role: ContentUserRole,
    profile?: ProfileModel | null,
    options?: {
      id?: string;
      config?: IPermissionConfig;
      userStatus?: UserStatus;
      relationStatus?: UserStatus;
      groups?: string[];
    }
  ) => {
    const permissionId = options?.id || 'test';
    return manager.verifyPermission(
      permissionId,
      {
        role: role,
        userStatus: options?.userStatus ?? UserStatus.Active,
        relationStatus: options?.relationStatus ?? UserStatus.Active,
        groups: options?.groups || [],
      },
      profile || new ProfileModel({}),
      options?.config || { visitorStrategy: { mode: VisitorMode.Disabled } }
    );
  };

  it('profile permission defaults', () => {
    registerTestPermission({
      min: ContentUserRole.Admin,
      max: ContentUserRole.Member,
      default: ContentUserRole.Member,
    });
    expect(verifyTestPermission(ContentUserRole.Owner)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Admin)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Manager)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Assignee)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Moderator)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Member)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Guest)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Organization)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Follower)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.User)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Visitor)).toEqual(false);
  });

  it('assure min role is respected', () => {
    registerTestPermission({
      min: ContentUserRole.Admin,
    });
    const profile = new ProfileModel({
      permissions: [{ id: 'test', role: ContentUserRole.Owner }],
    });
    expect(verifyTestPermission(ContentUserRole.Owner, profile)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Admin, profile)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Manager, profile)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Assignee, profile)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Moderator, profile)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Member, profile)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Guest, profile)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Organization, profile)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Follower, profile)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.User, profile)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Visitor, profile)).toEqual(false);
  });

  it('assure max role is respected', () => {
    registerTestPermission({
      max: ContentUserRole.Member,
    });
    const profile = new ProfileModel({
      permissions: [{ id: 'test', role: ContentUserRole.Guest }],
    });
    expect(verifyTestPermission(ContentUserRole.Owner, profile)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Admin, profile)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Manager, profile)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Assignee, profile)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Moderator, profile)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Member, profile)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Guest, profile)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Organization, profile)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Follower, profile)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.User, profile)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Visitor, profile)).toEqual(false);
  });

  it('profile permission overwritten by profile settings', () => {
    registerTestPermission({ default: ContentUserRole.Member });
    const profile = new ProfileModel({
      permissions: [{ id: 'test', role: ContentUserRole.Moderator }],
    });
    expect(verifyTestPermission(ContentUserRole.Owner, profile)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Admin, profile)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Manager, profile)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Assignee, profile)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Moderator, profile)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Member, profile)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Guest, profile)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Organization, profile)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Follower, profile)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.User, profile)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Visitor, profile)).toEqual(false);
  });

  it('profile permission overwritten by configuration', () => {
    registerTestPermission({ default: ContentUserRole.Member });

    const config: IPermissionConfig = {
      defaults: [{ id: 'test', role: ContentUserRole.Moderator }],
      visitorStrategy: { mode: VisitorMode.Disabled },
    };

    expect(verifyTestPermission(ContentUserRole.Owner, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Admin, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Manager, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Assignee, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Moderator, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Member, null, { config })).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Guest, null, { config })).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Organization, null, { config })).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Follower, null, { config })).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.User, null, { config })).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Visitor, null, { config })).toEqual(false);
  });

  it('do not allow visitors if not configured', () => {
    registerTestPermission({
      max: ContentUserRole.Visitor,
      default: ContentUserRole.Visitor,
    });

    const config: IPermissionConfig = {
      visitorStrategy: { mode: VisitorMode.Disabled },
    };

    expect(verifyTestPermission(ContentUserRole.Owner, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Admin, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Manager, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Assignee, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Moderator, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Member, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Guest, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Organization, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Follower, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.User, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Visitor, null, { config })).toEqual(false);
  });

  it('allow visitors if configured', () => {
    registerTestPermission({
      max: ContentUserRole.Visitor,
      default: ContentUserRole.Visitor,
    });

    const config: IPermissionConfig = {
      visitorStrategy: { mode: VisitorMode.Enabled, handles: [''] },
    };

    expect(verifyTestPermission(ContentUserRole.Owner, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Admin, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Manager, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Assignee, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Moderator, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Member, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Guest, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Organization, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Follower, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.User, null, { config })).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Visitor, null, { config })).toEqual(true);
  });

  it('invalid permission default will fallback to max', () => {
    registerTestPermission({
      min: ContentUserRole.Moderator,
      max: ContentUserRole.Member,
      default: ContentUserRole.User,
    });

    expect(verifyTestPermission(ContentUserRole.Owner)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Admin)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Manager)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Assignee)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Moderator)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Member)).toEqual(true);
    expect(verifyTestPermission(ContentUserRole.Guest)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Organization)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Follower)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.User)).toEqual(false);
    expect(verifyTestPermission(ContentUserRole.Visitor)).toEqual(false);
  });

  it('invalid min/max throws error', () => {
    registerTestPermission({
      min: ContentUserRole.Member,
      max: ContentUserRole.Moderator,
    });

    expect.assertions(1);

    try {
      verifyTestPermission(ContentUserRole.User);
    } catch (e) {
      expect(e instanceof IntegrityException).toEqual(true);
    }
  });

  it('test user access through group assignment', () => {
    registerTestPermission({
      min: ContentUserRole.Admin,
      max: ContentUserRole.Admin,
      default: ContentUserRole.Admin,
    });

    const testGroup = 'testGroup';

    const profile = new ProfileModel({
      permissions: [{ id: 'test', role: ContentUserRole.Admin, groups: [testGroup] }],
      groups: [{ id: testGroup, name: testGroup }],
    });

    expect(verifyTestPermission(ContentUserRole.Member, profile, { groups: [testGroup] })).toEqual(
      true
    );
    expect(verifyTestPermission(ContentUserRole.Member, profile)).toEqual(false);
  });

  it('test non existing group will be ignored', () => {
    registerTestPermission({
      min: ContentUserRole.Admin,
      max: ContentUserRole.Admin,
      default: ContentUserRole.Admin,
    });

    const testGroup = 'testGroup';

    const profile = new ProfileModel({
      permissions: [{ id: 'test', role: ContentUserRole.Admin, groups: [testGroup] }],
      groups: [],
    });

    expect(verifyTestPermission(ContentUserRole.Member, profile, { groups: [testGroup] })).toEqual(
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
      verifyTestPermission(ContentUserRole.User);
    } catch (e) {
      expect(e instanceof IntegrityException).toEqual(true);
    }
  });

  it('test invalid permission type', () => {
    registerTestPermission({
      type: BasePermissionType.User,
    });

    expect.assertions(1);

    try {
      verifyTestPermission(ContentUserRole.Member);
    } catch (e) {
      expect(e instanceof IntegrityException).toEqual(true);
    }
  });
});
