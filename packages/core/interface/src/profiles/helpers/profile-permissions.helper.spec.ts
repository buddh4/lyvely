import { clearPermissions, IPermissionConfig, registerPermissions } from '../../permissions';
import { ProfileRelationRole } from '../interfaces';
import { verifyProfilePermission } from './profile-permissions.helper';
import { ProfileModel } from '../models';
import { IntegrityException } from '@lyvely/common';
import { UserStatus } from '../../users';

describe('verifyProfilePermission', function () {
  afterEach(clearPermissions);

  it('profile permission defaults', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: ProfileRelationRole.Admin,
        max: ProfileRelationRole.Member,
        default: ProfileRelationRole.Member,
      },
    ]);
    const profile = new ProfileModel();
    expect(
      verifyProfilePermission('test', {
        settings: profile.permissions,
        role: ProfileRelationRole.Moderator,
        userStatus: UserStatus.Active,
        relationStatus: UserStatus.Active,
      }),
    ).toEqual(true);
    expect(
      verifyProfilePermission('test', {
        settings: profile.permissions,
        role: ProfileRelationRole.Member,
        userStatus: UserStatus.Active,
        relationStatus: UserStatus.Active,
      }),
    ).toEqual(true);
    expect(
      verifyProfilePermission('test', {
        settings: profile.permissions,
        role: ProfileRelationRole.Guest,
        userStatus: UserStatus.Active,
        relationStatus: UserStatus.Active,
      }),
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
      },
    ]);
    const profile = new ProfileModel({
      permissions: [{ id: 'test', role: ProfileRelationRole.Owner }],
    });
    expect(
      verifyProfilePermission('test', {
        settings: profile.permissions,
        role: ProfileRelationRole.Admin,
        userStatus: UserStatus.Active,
        relationStatus: UserStatus.Active,
      }),
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
      },
    ]);
    const profile = new ProfileModel({
      permissions: [{ id: 'test', role: ProfileRelationRole.Guest }],
    });
    expect(
      verifyProfilePermission('test', {
        settings: profile.permissions,
        role: ProfileRelationRole.Guest,
        userStatus: UserStatus.Active,
        relationStatus: UserStatus.Active,
      }),
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
      },
    ]);
    const profile = new ProfileModel({
      permissions: [{ id: 'test', role: ProfileRelationRole.Moderator }],
    });
    expect(
      verifyProfilePermission('test', {
        settings: profile.permissions,
        role: ProfileRelationRole.Admin,
        userStatus: UserStatus.Active,
        relationStatus: UserStatus.Active,
      }),
    ).toEqual(true);
    expect(
      verifyProfilePermission('test', {
        settings: profile.permissions,
        role: ProfileRelationRole.Moderator,
        userStatus: UserStatus.Active,
        relationStatus: UserStatus.Active,
      }),
    ).toEqual(true);
    expect(
      verifyProfilePermission('test', {
        settings: profile.permissions,
        role: ProfileRelationRole.Member,
        userStatus: UserStatus.Active,
        relationStatus: UserStatus.Active,
      }),
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
      },
    ]);

    const config: IPermissionConfig = {
      defaults: [{ id: 'test', role: ProfileRelationRole.Moderator }],
    };
    const profile = new ProfileModel();
    expect(
      verifyProfilePermission(
        'test',
        {
          settings: profile.permissions,
          role: ProfileRelationRole.Admin,
          userStatus: UserStatus.Active,
          relationStatus: UserStatus.Active,
        },
        config,
      ),
    ).toEqual(true);
    expect(
      verifyProfilePermission(
        'test',
        {
          settings: profile.permissions,
          role: ProfileRelationRole.Moderator,
          userStatus: UserStatus.Active,
          relationStatus: UserStatus.Active,
        },
        config,
      ),
    ).toEqual(true);
    expect(
      verifyProfilePermission(
        'test',
        {
          settings: profile.permissions,
          role: ProfileRelationRole.Member,
          userStatus: UserStatus.Active,
          relationStatus: UserStatus.Active,
        },
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
      },
    ]);
    const config: IPermissionConfig = {
      defaults: [{ id: 'test', role: ProfileRelationRole.Visitor }],
    };
    const profile = new ProfileModel();
    expect(
      verifyProfilePermission(
        'test',
        {
          settings: profile.permissions,
          role: ProfileRelationRole.Visitor,
        },
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
      },
    ]);
    const config: IPermissionConfig = {
      defaults: [{ id: 'test', role: ProfileRelationRole.Visitor }],
      allowVisitors: true,
    };
    const profile = new ProfileModel();
    expect(
      verifyProfilePermission(
        'test',
        {
          settings: profile.permissions,
          role: ProfileRelationRole.Member,
        },
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
      },
    ]);
    const profile = new ProfileModel();
    expect(
      verifyProfilePermission('test', {
        settings: profile.permissions,
        role: ProfileRelationRole.User,
        userStatus: UserStatus.Active,
        relationStatus: UserStatus.Active,
      }),
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
      },
    ]);
    const profile = new ProfileModel();

    expect.assertions(1);

    try {
      verifyProfilePermission('test', {
        settings: profile.permissions,
        role: ProfileRelationRole.User,
        userStatus: UserStatus.Active,
        relationStatus: UserStatus.Active,
      });
    } catch (e) {
      expect(e instanceof IntegrityException).toEqual(true);
    }
  });
});
