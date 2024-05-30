import {
  getPermission,
  IPermission,
  IProfilePermission,
  registerPermissions,
} from '@lyvely/interface';
import { useProfilePermissionsStore } from '../stores';
import { isPlainObject } from '@lyvely/common';
import { computed } from 'vue';

/**
 * Composable for reactive permission access checks.
 *
 * @param permissions
 */
export const useProfilePermissions = (...permissions: Array<string | IProfilePermission>) => {
  permissions.forEach((permission) => {
    if (isPlainObject<IPermission<any>>(permission) && !getPermission(permission.id)) {
      registerPermissions([permission]);
    }
  });

  // TODO: Support global user permissions
  const isAllowed = computed(() =>
    useProfilePermissionsStore().verifyAnyPermission(...permissions)
  );

  const isAllowedStrict = computed(() =>
    useProfilePermissionsStore().verifyEachPermission(...permissions)
  );

  return {
    isAllowed,
    isAllowedStrict,
  };
};
