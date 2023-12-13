import { getPermission, IPermission, registerPermissions } from '@lyvely/interface';
import { useProfilePermissionsStore, useProfileStore } from '@/profiles';
import { isPlainObject } from '@lyvely/common';
import { computed } from 'vue';

/**
 * Composable for reactive permission access checks.
 *
 * @param permissions
 */
export const usePermissions = (...permissions: Array<string | IPermission<any>>) => {
  permissions.forEach((permission) => {
    if (isPlainObject<IPermission<any>>(permission) && !getPermission(permission.id)) {
      registerPermissions([permission]);
    }
  });

  // TODO: Support global user permissions
  const isAllowed = computed(() =>
    useProfilePermissionsStore().verifyEachPermission(...permissions),
  );

  return {
    isAllowed,
  };
};
