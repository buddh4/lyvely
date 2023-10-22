import { defineStore, storeToRefs } from 'pinia';
import { ref, Ref, watch } from 'vue';
import { useProfileFeaturesService, useProfileStore } from '@/profiles';
import { useAppConfigStore } from '@/app-config';
import {
  IFeature,
  IFeatureConfig,
  FEATURE_MODULE_ID,
  isEnabledProfileFeature,
  getProfileFeaturesWithSettings,
  getFeature,
  getAffectedFeatures,
  UpdateFeatureModel,
} from '@lyvely/core-interface';
import { useGlobalDialogStore } from '@/core';

export const useProfileFeatureStore = defineStore('profile-feature-store', () => {
  const featureStateMap = new Map<string, Ref<boolean>>();
  const { profile } = storeToRefs(useProfileStore());

  watch(profile, reset);

  function reset() {
    featureStateMap.clear();
  }

  function isFeatureEnabled(featureId: string): Ref<boolean> {
    let state = featureStateMap.get(featureId);
    if (state) return state;

    const featureConfig = useAppConfigStore().getModuleConfig<IFeatureConfig>(FEATURE_MODULE_ID);
    state = ref(isEnabledProfileFeature(featureId, profile.value!, featureConfig));
    featureStateMap.set(featureId, state);
    return state;
  }

  async function setFeatureState(featureId: string, state: boolean): Promise<void> {
    const feature = getFeature(featureId);

    if (!feature) return;

    const currentState = isFeatureEnabled(featureId);
    currentState.value = state;

    const affectedModules = getAffectedFeatures(feature, state);
    affectedModules.forEach((feature) => _setState(feature.id, state));

    try {
      const { disabled, enabled } = await useProfileFeaturesService().updateState(
        new UpdateFeatureModel({ featureId, state }),
      );

      disabled.forEach((featureId) => _setState(featureId, false));
      enabled.forEach((featureId) => _setState(featureId, true));

      profile.value!.disabledFeatures = disabled;
      profile.value!.enabledFeatures = enabled;
    } catch (e) {
      currentState.value = !state;
      affectedModules.forEach((feature) => _setState(feature.id, !state));
      useGlobalDialogStore().showUnknownError();
    }
  }

  function _setState(featureId: string, enabled: boolean) {
    const state = isFeatureEnabled(featureId);
    state.value = enabled;
  }

  function getSettingFeaturesOfProfile(): IFeature[] {
    const featureConfig = useAppConfigStore().getModuleConfig<IFeatureConfig>(FEATURE_MODULE_ID);
    return getProfileFeaturesWithSettings(profile.value!, featureConfig);
  }

  return {
    isFeatureEnabled,
    setFeatureEnabled: setFeatureState,
    getSettingFeaturesOfProfile,
  };
});
