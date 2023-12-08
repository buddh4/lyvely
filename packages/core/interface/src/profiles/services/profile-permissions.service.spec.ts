import {
  BasePermissionType,
  clearPermissions,
  IPermission,
  IPermissionConfig,
  registerPermissions,
} from '../../permissions';
import { ProfileRelationRole } from '../interfaces';
import { ProfileModel } from '../models';
import { IntegrityException } from '../../exceptions';
import { UserStatus, VisitorMode } from '../../users';
import { useProfilePermissionsService } from './profile-permissions.service';

describe('ProfilePermissionsService', function () {
  afterEach(clearPermissions);

  const service = useProfilePermissionsService();

  const registerTestPermission = (data?: Partial<IPermission<any, any>>) => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: ProfileRelationRole.Admin,
        max: ProfileRelationRole.Member,
        default: ProfileRelationRole.Member,
        type: BasePermissionType.Profile,
        ...data,
      },
    ]);
  };

  const verifyTestPermission = (
    role: ProfileRelationRole,
    profile?: ProfileModel | null,
    options?: {
      id?: string;
      config?: IPermissionConfig;
      userStatus?: UserStatus;
      relationStatus?: UserStatus;
      groups?: string[];
    },
  ) => {
    profile ||= new ProfileModel();
    const permissionId = options?.id || 'test';
    return service.verifyPermission(
      permissionId,
      {
        role: role,
        userStatus: options?.userStatus ?? UserStatus.Active,
        relationStatus: options?.relationStatus ?? UserStatus.Active,
        groups: options?.groups || [],
      },
      profile,
      options?.config || { visitorStrategy: { mode: VisitorMode.Disabled } },
    );
  };

  it('profile permission defaults', () => {
    registerTestPermission({
      min: ProfileRelationRole.Admin,
      max: ProfileRelationRole.Member,
      default: ProfileRelationRole.Member,
    });
    expect(verifyTestPermission(ProfileRelationRole.Owner)).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Admin)).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Moderator)).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Member)).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Guest)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Organization)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Follower)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.User)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Visitor)).toEqual(false);
  });

  it('assure min role is respected', () => {
    registerTestPermission({
      min: ProfileRelationRole.Admin,
    });
    const profile = new ProfileModel({
      permissions: [{ id: 'test', role: ProfileRelationRole.Owner }],
    });
    expect(verifyTestPermission(ProfileRelationRole.Owner, profile)).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Admin, profile)).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Moderator, profile)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Member, profile)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Guest, profile)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Organization, profile)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Follower, profile)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.User, profile)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Visitor, profile)).toEqual(false);
  });

  it('assure max role is respected', () => {
    registerTestPermission({
      max: ProfileRelationRole.Member,
    });
    const profile = new ProfileModel({
      permissions: [{ id: 'test', role: ProfileRelationRole.Guest }],
    });
    expect(verifyTestPermission(ProfileRelationRole.Owner, profile)).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Admin, profile)).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Moderator, profile)).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Member, profile)).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Guest, profile)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Organization, profile)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Follower, profile)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.User, profile)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Visitor, profile)).toEqual(false);
  });

  it('profile permission overwritten by profile settings', () => {
    registerTestPermission({ default: ProfileRelationRole.Member });
    const profile = new ProfileModel({
      permissions: [{ id: 'test', role: ProfileRelationRole.Moderator }],
    });
    expect(verifyTestPermission(ProfileRelationRole.Owner, profile)).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Admin, profile)).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Moderator, profile)).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Member, profile)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Guest, profile)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Organization, profile)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Follower, profile)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.User, profile)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Visitor, profile)).toEqual(false);
  });

  it('profile permission overwritten by configuration', () => {
    registerTestPermission({ default: ProfileRelationRole.Member });

    const config: IPermissionConfig = {
      defaults: [{ id: 'test', role: ProfileRelationRole.Moderator }],
      visitorStrategy: { mode: VisitorMode.Disabled },
    };

    expect(verifyTestPermission(ProfileRelationRole.Owner, null, { config })).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Admin, null, { config })).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Moderator, null, { config })).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Member, null, { config })).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Guest, null, { config })).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Organization, null, { config })).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Follower, null, { config })).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.User, null, { config })).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Visitor, null, { config })).toEqual(false);
  });

  it('do not allow visitors if not configured', () => {
    registerTestPermission({
      max: ProfileRelationRole.Visitor,
      default: ProfileRelationRole.Visitor,
    });

    const config: IPermissionConfig = {
      visitorStrategy: { mode: VisitorMode.Disabled },
    };

    expect(verifyTestPermission(ProfileRelationRole.Owner, null, { config })).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Admin, null, { config })).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Moderator, null, { config })).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Member, null, { config })).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Guest, null, { config })).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Organization, null, { config })).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Follower, null, { config })).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.User, null, { config })).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Visitor, null, { config })).toEqual(false);
  });

  it('allow visitors if configured', () => {
    registerTestPermission({
      max: ProfileRelationRole.Visitor,
      default: ProfileRelationRole.Visitor,
    });

    const config: IPermissionConfig = {
      visitorStrategy: { mode: VisitorMode.Enabled, handles: [''] },
    };

    expect(verifyTestPermission(ProfileRelationRole.Owner, null, { config })).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Admin, null, { config })).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Moderator, null, { config })).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Member, null, { config })).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Guest, null, { config })).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Organization, null, { config })).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Follower, null, { config })).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.User, null, { config })).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Visitor, null, { config })).toEqual(true);
  });

  it('invalid permission default will fallback to max', () => {
    registerTestPermission({
      min: ProfileRelationRole.Moderator,
      max: ProfileRelationRole.Member,
      default: ProfileRelationRole.User,
    });

    expect(verifyTestPermission(ProfileRelationRole.Owner)).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Admin)).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Moderator)).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Member)).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Guest)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Organization)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Follower)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.User)).toEqual(false);
    expect(verifyTestPermission(ProfileRelationRole.Visitor)).toEqual(false);
  });

  it('invalid min/max throws error', () => {
    registerTestPermission({
      min: ProfileRelationRole.Member,
      max: ProfileRelationRole.Moderator,
    });

    expect.assertions(1);

    try {
      verifyTestPermission(ProfileRelationRole.User);
    } catch (e) {
      expect(e instanceof IntegrityException).toEqual(true);
    }
  });

  it('test user access through group assignment', () => {
    registerTestPermission({
      min: ProfileRelationRole.Admin,
      max: ProfileRelationRole.Admin,
      default: ProfileRelationRole.Admin,
    });

    const testGroup = 'testGroup';

    const profile = new ProfileModel({
      permissions: [{ id: 'test', role: ProfileRelationRole.Admin, groups: [testGroup] }],
      groups: [{ id: testGroup, name: testGroup }],
    });

    expect(
      verifyTestPermission(ProfileRelationRole.Member, profile, { groups: [testGroup] }),
    ).toEqual(true);
    expect(verifyTestPermission(ProfileRelationRole.Member, profile)).toEqual(false);
  });

  it('test non existing group will be ignored', () => {
    registerTestPermission({
      min: ProfileRelationRole.Admin,
      max: ProfileRelationRole.Admin,
      default: ProfileRelationRole.Admin,
    });

    const testGroup = 'testGroup';

    const profile = new ProfileModel({
      permissions: [{ id: 'test', role: ProfileRelationRole.Admin, groups: [testGroup] }],
      groups: [],
    });

    expect(
      verifyTestPermission(ProfileRelationRole.Member, profile, { groups: [testGroup] }),
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
      verifyTestPermission(ProfileRelationRole.User);
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
      verifyTestPermission(ProfileRelationRole.Member);
    } catch (e) {
      expect(e instanceof IntegrityException).toEqual(true);
    }
  });
});