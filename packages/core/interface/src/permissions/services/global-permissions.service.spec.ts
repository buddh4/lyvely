import {
  BasePermissionType,
  clearPermissions,
  GlobalPermissionRole,
  IPermissionConfig,
  registerPermissions,
} from '../index';
import { IntegrityException } from '../../exceptions';
import { UserStatus, VisitorMode } from '../../users';
import { useGlobalPermissionsService } from './global-permissions.service';

describe('GlobalPermissionsService', function () {
  afterEach(clearPermissions);

  const service = useGlobalPermissionsService();

  it('profile permission defaults', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: GlobalPermissionRole.Admin,
        max: GlobalPermissionRole.User,
        default: GlobalPermissionRole.User,
        type: BasePermissionType.Global,
      },
    ]);

    expect(
      service.verifyPermission(
        'test',
        {
          role: GlobalPermissionRole.Support,
          userStatus: UserStatus.Active,
        },
        {
          getPermissionSettings: () => [],
        },
        { visitorStrategy: { mode: VisitorMode.Disabled } },
      ),
    ).toEqual(true);
    expect(
      service.verifyPermission(
        'test',
        {
          role: GlobalPermissionRole.User,
          userStatus: UserStatus.Active,
        },
        { getPermissionSettings: () => [] },
        { visitorStrategy: { mode: VisitorMode.Disabled } },
      ),
    ).toEqual(true);
    expect(
      service.verifyPermission(
        'test',
        { role: GlobalPermissionRole.Visitor },
        { getPermissionSettings: () => [] },
        { visitorStrategy: { mode: VisitorMode.Disabled } },
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
        type: BasePermissionType.Global,
      },
    ]);
    expect(
      service.verifyPermission(
        'test',
        {
          role: GlobalPermissionRole.User,
          userStatus: UserStatus.Active,
        },
        { getPermissionSettings: () => [] },
        { visitorStrategy: { mode: VisitorMode.Disabled } },
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
        type: BasePermissionType.Global,
      },
    ]);

    expect(
      service.verifyPermission(
        'test',
        {
          role: GlobalPermissionRole.User,
          userStatus: UserStatus.Active,
        },
        { getPermissionSettings: () => [] },
        { visitorStrategy: { mode: VisitorMode.Disabled } },
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
        type: BasePermissionType.Global,
      },
    ]);

    const config: IPermissionConfig = {
      defaults: [{ id: 'test', role: GlobalPermissionRole.Admin }],
      visitorStrategy: { mode: VisitorMode.Disabled },
    };

    expect(
      service.verifyPermission(
        'test',
        { role: GlobalPermissionRole.Admin, userStatus: UserStatus.Active },
        { getPermissionSettings: () => [] },
        config,
      ),
    ).toEqual(true);
    expect(
      service.verifyPermission(
        'test',
        { role: GlobalPermissionRole.User, userStatus: UserStatus.Active },
        { getPermissionSettings: () => [] },
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
        type: BasePermissionType.Global,
      },
    ]);
    const config: IPermissionConfig = {
      defaults: [{ id: 'test', role: GlobalPermissionRole.Visitor }],
      visitorStrategy: { mode: VisitorMode.Disabled },
    };
    expect(
      service.verifyPermission(
        'test',
        { role: GlobalPermissionRole.Visitor, userStatus: UserStatus.Active },
        { getPermissionSettings: () => [] },
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
        type: BasePermissionType.Global,
      },
    ]);
    const config: IPermissionConfig = {
      defaults: [{ id: 'test', role: GlobalPermissionRole.Visitor }],
      visitorStrategy: { mode: VisitorMode.Enabled, handles: [''] },
    };
    expect(
      service.verifyPermission(
        'test',
        { role: GlobalPermissionRole.Visitor, userStatus: UserStatus.Active },
        { getPermissionSettings: () => [] },
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
        type: BasePermissionType.Global,
      },
    ]);
    expect(
      service.verifyPermission(
        'test',
        {
          role: GlobalPermissionRole.User,
          userStatus: UserStatus.Active,
        },
        { getPermissionSettings: () => [] },
        { visitorStrategy: { mode: VisitorMode.Disabled } },
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
        type: BasePermissionType.Global,
      },
    ]);

    expect.assertions(1);

    try {
      service.verifyPermission(
        'test',
        {
          role: GlobalPermissionRole.User,
          userStatus: UserStatus.Active,
        },
        { getPermissionSettings: () => [] },
        { visitorStrategy: { mode: VisitorMode.Disabled } },
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
        type: BasePermissionType.Global,
      },
    ]);

    expect(
      service.verifyPermission(
        'test',
        {
          role: GlobalPermissionRole.User,
          userStatus: UserStatus.Disabled,
        },
        { getPermissionSettings: () => [] },
        { visitorStrategy: { mode: VisitorMode.Disabled } },
      ),
    ).toEqual(false);
  });

  it('check invalid permission type', () => {
    registerPermissions([
      {
        id: 'test',
        moduleId: 'test',
        min: GlobalPermissionRole.Admin,
        max: GlobalPermissionRole.User,
        default: GlobalPermissionRole.User,
        userStatuses: [UserStatus.EmailVerification],
        type: BasePermissionType.Profile,
      },
    ]);

    expect.assertions(1);

    try {
      service.verifyPermission(
        'test',
        {
          role: GlobalPermissionRole.User,
          userStatus: UserStatus.EmailVerification,
        },
        { getPermissionSettings: () => [] },
        { visitorStrategy: { mode: VisitorMode.Disabled } },
      );
    } catch (e) {
      expect(e instanceof IntegrityException).toEqual(true);
    }
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
        type: BasePermissionType.Global,
      },
    ]);

    expect(
      service.verifyPermission(
        'test',
        {
          role: GlobalPermissionRole.User,
          userStatus: UserStatus.EmailVerification,
        },
        { getPermissionSettings: () => [] },
        { visitorStrategy: { mode: VisitorMode.Disabled } },
      ),
    ).toEqual(true);
  });
});
