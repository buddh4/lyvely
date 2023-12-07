import {
  BasePermissionType,
  clearPermissions,
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

  it('profile permission defaults', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: ProfileRelationRole.Admin,
        max: ProfileRelationRole.Member,
        default: ProfileRelationRole.Member,
        type: BasePermissionType.Profile,
      },
    ]);
    const profile = new ProfileModel();
    expect(
      service.verifyPermission(
        'test',
        {
          role: ProfileRelationRole.Moderator,
          userStatus: UserStatus.Active,
          relationStatus: UserStatus.Active,
        },
        profile,
        { visitorStrategy: { mode: VisitorMode.Disabled } },
      ),
    ).toEqual(true);
    expect(
      service.verifyPermission(
        'test',
        {
          role: ProfileRelationRole.Member,
          userStatus: UserStatus.Active,
          relationStatus: UserStatus.Active,
        },
        profile,
        { visitorStrategy: { mode: VisitorMode.Disabled } },
      ),
    ).toEqual(true);
    expect(
      service.verifyPermission(
        'test',
        {
          role: ProfileRelationRole.Guest,
          userStatus: UserStatus.Active,
          relationStatus: UserStatus.Active,
        },
        profile,
        { visitorStrategy: { mode: VisitorMode.Disabled } },
      ),
    ).toEqual(false);
  });

  it('assure min role is respected', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: ProfileRelationRole.Admin,
        max: ProfileRelationRole.Member,
        default: ProfileRelationRole.Member,
        type: BasePermissionType.Profile,
      },
    ]);
    const profile = new ProfileModel({
      permissions: [{ id: 'test', role: ProfileRelationRole.Owner }],
    });
    expect(
      service.verifyPermission(
        'test',
        {
          role: ProfileRelationRole.Admin,
          userStatus: UserStatus.Active,
          relationStatus: UserStatus.Active,
        },
        profile,
        { visitorStrategy: { mode: VisitorMode.Disabled } },
      ),
    ).toEqual(true);
  });

  it('assure max role is respected', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: ProfileRelationRole.Admin,
        max: ProfileRelationRole.Member,
        default: ProfileRelationRole.Member,
        type: BasePermissionType.Profile,
      },
    ]);
    const profile = new ProfileModel({
      permissions: [{ id: 'test', role: ProfileRelationRole.Guest }],
    });
    expect(
      service.verifyPermission(
        'test',
        {
          role: ProfileRelationRole.Guest,
          userStatus: UserStatus.Active,
          relationStatus: UserStatus.Active,
        },
        profile,
        { visitorStrategy: { mode: VisitorMode.Disabled } },
      ),
    ).toEqual(false);
  });

  it('profile permission overwritten by profile settings', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: ProfileRelationRole.Admin,
        max: ProfileRelationRole.Member,
        default: ProfileRelationRole.Member,
        type: BasePermissionType.Profile,
      },
    ]);
    const profile = new ProfileModel({
      permissions: [{ id: 'test', role: ProfileRelationRole.Moderator }],
    });
    expect(
      service.verifyPermission(
        'test',
        {
          role: ProfileRelationRole.Admin,
          userStatus: UserStatus.Active,
          relationStatus: UserStatus.Active,
        },
        profile,
        { visitorStrategy: { mode: VisitorMode.Disabled } },
      ),
    ).toEqual(true);
    expect(
      service.verifyPermission(
        'test',
        {
          role: ProfileRelationRole.Moderator,
          userStatus: UserStatus.Active,
          relationStatus: UserStatus.Active,
        },
        profile,
        { visitorStrategy: { mode: VisitorMode.Disabled } },
      ),
    ).toEqual(true);
    expect(
      service.verifyPermission(
        'test',
        {
          role: ProfileRelationRole.Member,
          userStatus: UserStatus.Active,
          relationStatus: UserStatus.Active,
        },
        profile,
        { visitorStrategy: { mode: VisitorMode.Disabled } },
      ),
    ).toEqual(false);
  });

  it('profile permission overwritten by configuration', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: ProfileRelationRole.Admin,
        max: ProfileRelationRole.Member,
        default: ProfileRelationRole.Member,
        type: BasePermissionType.Profile,
      },
    ]);

    const config: IPermissionConfig = {
      defaults: [{ id: 'test', role: ProfileRelationRole.Moderator }],
      visitorStrategy: { mode: VisitorMode.Disabled },
    };
    const profile = new ProfileModel();
    expect(
      service.verifyPermission(
        'test',
        {
          role: ProfileRelationRole.Admin,
          userStatus: UserStatus.Active,
          relationStatus: UserStatus.Active,
        },
        profile,
        config,
      ),
    ).toEqual(true);
    expect(
      service.verifyPermission(
        'test',
        {
          role: ProfileRelationRole.Moderator,
          userStatus: UserStatus.Active,
          relationStatus: UserStatus.Active,
        },
        profile,
        config,
      ),
    ).toEqual(true);
    expect(
      service.verifyPermission(
        'test',
        {
          role: ProfileRelationRole.Member,
          userStatus: UserStatus.Active,
          relationStatus: UserStatus.Active,
        },
        profile,
        config,
      ),
    ).toEqual(false);
  });

  it('do not allow visitors if not configured', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: ProfileRelationRole.Member,
        max: ProfileRelationRole.Visitor,
        default: ProfileRelationRole.Visitor,
        type: BasePermissionType.Profile,
      },
    ]);
    const config: IPermissionConfig = {
      defaults: [{ id: 'test', role: ProfileRelationRole.Visitor }],
      visitorStrategy: { mode: VisitorMode.Disabled },
    };
    const profile = new ProfileModel();
    expect(
      service.verifyPermission(
        'test',
        {
          role: ProfileRelationRole.Visitor,
        },
        profile,
        config,
      ),
    ).toEqual(false);
  });
  it('allow visitors if configured', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: ProfileRelationRole.Member,
        max: ProfileRelationRole.Visitor,
        default: ProfileRelationRole.Visitor,
        type: BasePermissionType.Profile,
      },
    ]);
    const config: IPermissionConfig = {
      defaults: [{ id: 'test', role: ProfileRelationRole.Visitor }],
      visitorStrategy: { mode: VisitorMode.Enabled, handles: [''] },
    };
    const profile = new ProfileModel();
    expect(
      service.verifyPermission(
        'test',
        {
          role: ProfileRelationRole.Member,
        },
        profile,
        config,
      ),
    ).toEqual(true);
  });

  it('invalid permission default will fallback to max', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: ProfileRelationRole.Moderator,
        max: ProfileRelationRole.Member,
        default: ProfileRelationRole.User,
        type: BasePermissionType.Profile,
      },
    ]);
    const profile = new ProfileModel();
    expect(
      service.verifyPermission(
        'test',
        {
          role: ProfileRelationRole.User,
          userStatus: UserStatus.Active,
          relationStatus: UserStatus.Active,
        },
        profile,
        { visitorStrategy: { mode: VisitorMode.Disabled } },
      ),
    ).toEqual(false);
  });

  it('invalid min/max throws error', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: ProfileRelationRole.Member,
        max: ProfileRelationRole.Moderator,
        default: ProfileRelationRole.User,
        type: BasePermissionType.Profile,
      },
    ]);
    const profile = new ProfileModel();

    expect.assertions(1);

    try {
      service.verifyPermission(
        'test',
        {
          role: ProfileRelationRole.User,
          userStatus: UserStatus.Active,
          relationStatus: UserStatus.Active,
        },
        profile,
        { visitorStrategy: { mode: VisitorMode.Disabled } },
      );
    } catch (e) {
      expect(e instanceof IntegrityException).toEqual(true);
    }
  });
});
