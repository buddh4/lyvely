import { defineStore } from 'pinia';
import {
  IPermission,
  IProfilePermission,
  IContentPermission,
  isProfilePermission,
  useContentPermissionsManager,
  useProfilePermissionsManager,
  IProfilePermissionObject,
  VisitorMode,
  AbstractPermissionsManager,
  getProfileRelationRole,
  ProfilePermissionSettingModel,
  useProfilePermissionsClient,
  ProfileRelationRole,
  ContentUserRole,
  getAllPermissions,
  BasePermissionType,
  IPermissionManagerConfig,
  FEATURE_MODULE_ID,
  type IFeatureConfig,
  IPermissionConfig,
} from '@lyvely/interface';
import { useProfileStore } from './profile.store';
import { useAuthStore } from '@/auth';
import { loadingState, useGlobalDialogStore } from '@/core';
import { findAndReplace } from '@lyvely/common';
import { useAppConfigStore } from '@/app-config';

export const useProfilePermissionsStore = defineStore('profile-permissions-store', () => {
  function getPermissionOptions(permission: IContentPermission | IProfilePermission) {
    const { profile } = useProfileStore();
    if (!profile) return [];
    const permissionManager = _getPermissionManager(permission);
    return permissionManager
      .getRoleHierarchy()
      .filter(
        (role) =>
          permissionManager.getValidRoleLevel(
            permission,
            profile,
            getPermissionConfig(),
            permissionManager.getRoleLevel(role)
          ) === permissionManager.getRoleLevel(role)
      )
      .map((value) => ({
        label: `profiles.settings.permissions.roles.${value}`,
        value: value,
      }));
  }

  function getActiveRole(permission: IPermission<any, any>) {
    return _getPermissionManager(permission).getActiveRole(
      permission,
      useProfileStore().profile as IProfilePermissionObject,
      getPermissionConfig()
    );
  }

  async function setActiveRole(permission: IPermission<any, any>, role: string) {
    return loadingState(
      useProfilePermissionsClient().updateProfilePermission(
        new ProfilePermissionSettingModel({
          id: permission.id,
          role: role as ContentUserRole | ProfileRelationRole,
        })
      )
    )
      .then((setting) =>
        findAndReplace(useProfileStore().profile!.permissions, setting, 'id', true)
      )
      .catch((e) => {
        console.error(e);
        useGlobalDialogStore().showUnknownError();
      });
  }

  function verifyEachPermission(...permissions: Array<string | IProfilePermission>) {
    const currentProfile = useProfileStore().profile;

    if (!currentProfile) {
      console.error('checkPermissions called without existing profile');
      return false;
    }

    const authStore = useAuthStore();
    const { user } = authStore;

    // TODO: How to handle different kinds of relation?
    return useProfilePermissionsManager().verifyEach(
      permissions,
      {
        relationStatus: currentProfile.getMembership()?.relationStatus,
        userStatus: user?.status,
        role: currentProfile.role,
      },
      currentProfile as IProfilePermissionObject,
      getPermissionConfig()
    );
  }

  function verifyAnyPermission(...permissions: Array<string | IProfilePermission>) {
    const currentProfile = useProfileStore().profile;

    if (!currentProfile) {
      console.error('checkPermissions called without existing profile');
      return false;
    }

    const authStore = useAuthStore();
    const { user } = authStore;
    const { userRelations, userOrganizationRelations } = currentProfile;

    // TODO: How to handle different kinds of relation?
    return useProfilePermissionsManager().verifyAny(
      permissions,
      {
        relationStatus: currentProfile.getMembership()?.relationStatus,
        userStatus: user?.status,
        role: getProfileRelationRole(user, userRelations, userOrganizationRelations),
      },
      currentProfile as IProfilePermissionObject,
      getPermissionConfig()
    );
  }

  function getPermissionConfig(): IPermissionManagerConfig {
    const permissionConfig = useAppConfigStore().getModuleConfig<IPermissionConfig>(
      'permissions',
      undefined,
      {
        visitorStrategy: { mode: VisitorMode.Disabled },
        defaults: [],
      }
    );

    return {
      ...permissionConfig,
      featureConfig: useAppConfigStore().getModuleConfig<IFeatureConfig>(FEATURE_MODULE_ID),
    };
  }

  function _getPermissionManager(
    permission: IPermission
  ): AbstractPermissionsManager<any, any, any> {
    return isProfilePermission(permission)
      ? useProfilePermissionsManager()
      : useContentPermissionsManager();
  }

  function getPermissions() {
    const { profile } = useProfileStore();
    const permissions = [
      ...getAllPermissions<IProfilePermission>(BasePermissionType.Profile),
      ...getAllPermissions<IContentPermission>(BasePermissionType.Content),
    ].filter((p) => !p.profileTypes || p.profileTypes.includes(profile!.type));

    permissions.sort((a, b) => (a.moduleId > b.moduleId ? 1 : -1));
    return permissions;
  }

  return {
    getPermissionOptions,
    getActiveRole,
    setActiveRole,
    getPermissions,
    verifyEachPermission,
    verifyAnyPermission,
  };
});
