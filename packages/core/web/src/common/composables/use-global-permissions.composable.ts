import {
  getPermission,
  UserRole,
  type IGlobalPermission,
  IPermission,
  registerPermissions,
  useGlobalPermissionsManager,
  VisitorMode,
  IPermissionConfig,
} from '@lyvely/interface';
import { isPlainObject } from '@lyvely/common';
import { computed } from 'vue';
import { useAuthStore } from '@/auth';
import { useAppConfigStore } from '@/app-config';

/**
 * Composable for reactive permission access checks.
 *
 * @param permissions
 */
export const useGlobalPermissions = (...permissions: Array<string | IGlobalPermission>) => {
  permissions.forEach((permission) => {
    if (isPlainObject<IPermission<any>>(permission) && !getPermission(permission.id)) {
      registerPermissions([permission]);
    }
  });

  // TODO: Support global user permissions
  const isAllowed = computed(() => {
    const user = useAuthStore().user;
    const role = useAuthStore().user?.role ?? UserRole.Visitor;
    return useGlobalPermissionsManager().verifyAny(
      permissions,
      { role, userStatus: user?.status },
      {
        getPermissionSettings: () => [],
        getPermissionGroups: () => [],
      },
      getPermissionConfig()
    );
  });

  function getPermissionConfig() {
    return useAppConfigStore().getModuleConfig<IPermissionConfig>('permissions', undefined, {
      visitorStrategy: { mode: VisitorMode.Disabled },
      defaults: [],
    });
  }

  const isAllowedStrict = computed(() => {
    const user = useAuthStore().user;
    const role = useAuthStore().user?.role ?? UserRole.Visitor;
    return useGlobalPermissionsManager().verifyEach(
      permissions,
      { role, userStatus: user?.status },
      {
        getPermissionSettings: () => [],
        getPermissionGroups: () => [],
      },
      getPermissionConfig()
    );
  });

  return {
    isAllowed,
    isAllowedStrict,
  };
};
