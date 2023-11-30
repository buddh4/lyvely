import {
  clearPermissions,
  GlobalPermissionRole,
  IPermissionOptions,
  registerPermissions,
} from '../index';
import { verifyGlobalPermission } from './permissions.helper';
import { IntegrityException } from '@lyvely/interface';
import { UserStatus } from '../../users';

describe('verifyGlobalPermission', function () {
  afterEach(clearPermissions);

  it('profile permission defaults', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: GlobalPermissionRole.Admin,
        max: GlobalPermissionRole.User,
        default: GlobalPermissionRole.User,
        global: true,
      },
    ]);
    expect(
      verifyGlobalPermission(
        'test',
        {
          role: GlobalPermissionRole.Support,
          userStatus: UserStatus.Active,
        },
        { visitorsAllowed: false },
      ),
    ).toEqual(true);
    expect(
      verifyGlobalPermission(
        'test',
        {
          role: GlobalPermissionRole.User,
          userStatus: UserStatus.Active,
        },
        { visitorsAllowed: false },
      ),
    ).toEqual(true);
    expect(
      verifyGlobalPermission(
        'test',
        { role: GlobalPermissionRole.Visitor },
        { visitorsAllowed: false },
      ),
    ).toEqual(false);
  });

  it('assure min role is respected', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: GlobalPermissionRole.User,
        max: GlobalPermissionRole.Visitor,
        default: GlobalPermissionRole.Admin,
        global: true,
      },
    ]);
    expect(
      verifyGlobalPermission(
        'test',
        {
          role: GlobalPermissionRole.User,
          userStatus: UserStatus.Active,
        },
        { visitorsAllowed: false },
      ),
    ).toEqual(true);
  });

  it('assure max role is respected', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: GlobalPermissionRole.Admin,
        max: GlobalPermissionRole.Support,
        default: GlobalPermissionRole.User,
      },
    ]);

    expect(
      verifyGlobalPermission(
        'test',
        {
          role: GlobalPermissionRole.User,
          userStatus: UserStatus.Active,
        },
        { visitorsAllowed: false },
      ),
    ).toEqual(false);
  });

  it('profile permission overwritten by configuration', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: GlobalPermissionRole.Admin,
        max: GlobalPermissionRole.User,
        default: GlobalPermissionRole.User,
        global: true,
      },
    ]);

    const config: IPermissionOptions = {
      defaults: [{ id: 'test', role: GlobalPermissionRole.Admin }],
      visitorsAllowed: false,
    };

    expect(
      verifyGlobalPermission(
        'test',
        { role: GlobalPermissionRole.Admin, userStatus: UserStatus.Active },
        config,
      ),
    ).toEqual(true);
    expect(
      verifyGlobalPermission(
        'test',
        { role: GlobalPermissionRole.User, userStatus: UserStatus.Active },
        config,
      ),
    ).toEqual(false);
  });

  it('do not allow visitors if not configured', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: GlobalPermissionRole.User,
        max: GlobalPermissionRole.Visitor,
        default: GlobalPermissionRole.Visitor,
      },
    ]);
    const config: IPermissionOptions = {
      defaults: [{ id: 'test', role: GlobalPermissionRole.Visitor }],
      visitorsAllowed: false,
    };
    expect(
      verifyGlobalPermission(
        'test',
        { role: GlobalPermissionRole.Visitor, userStatus: UserStatus.Active },
        config,
      ),
    ).toEqual(false);
  });

  it('allow visitors if configured', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: GlobalPermissionRole.User,
        max: GlobalPermissionRole.Visitor,
        default: GlobalPermissionRole.Visitor,
        global: true,
      },
    ]);
    const config: IPermissionOptions = {
      defaults: [{ id: 'test', role: GlobalPermissionRole.Visitor }],
      visitorsAllowed: true,
    };
    expect(
      verifyGlobalPermission(
        'test',
        { role: GlobalPermissionRole.Visitor, userStatus: UserStatus.Active },
        config,
      ),
    ).toEqual(true);
  });

  it('invalid permission default will fallback to max', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: GlobalPermissionRole.Admin,
        max: GlobalPermissionRole.Support,
        default: GlobalPermissionRole.User,
        global: true,
      },
    ]);
    expect(
      verifyGlobalPermission(
        'test',
        {
          role: GlobalPermissionRole.User,
          userStatus: UserStatus.Active,
        },
        { visitorsAllowed: false },
      ),
    ).toEqual(false);
  });

  it('invalid min/max throws error', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: GlobalPermissionRole.User,
        max: GlobalPermissionRole.Admin,
        default: GlobalPermissionRole.User,
        global: true,
      },
    ]);

    expect.assertions(1);

    try {
      verifyGlobalPermission(
        'test',
        {
          role: GlobalPermissionRole.User,
          userStatus: UserStatus.Active,
        },
        { visitorsAllowed: false },
      );
    } catch (e) {
      expect(e instanceof IntegrityException).toEqual(true);
    }
  });

  it('check default user status = Active', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: GlobalPermissionRole.Admin,
        max: GlobalPermissionRole.User,
        default: GlobalPermissionRole.User,
        global: true,
      },
    ]);

    expect(
      verifyGlobalPermission(
        'test',
        {
          role: GlobalPermissionRole.User,
          userStatus: UserStatus.Disabled,
        },
        { visitorsAllowed: false },
      ),
    ).toEqual(false);
  });

  it('check overwrite default user status requirement', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: GlobalPermissionRole.Admin,
        max: GlobalPermissionRole.User,
        default: GlobalPermissionRole.User,
        userStatuses: [UserStatus.EmailVerification],
        global: true,
      },
    ]);

    expect(
      verifyGlobalPermission(
        'test',
        {
          role: GlobalPermissionRole.User,
          userStatus: UserStatus.EmailVerification,
        },
        { visitorsAllowed: false },
      ),
    ).toEqual(true);
  });
});
