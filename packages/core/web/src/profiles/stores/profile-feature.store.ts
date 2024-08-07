import { defineStore, storeToRefs } from 'pinia';
import { ref, Ref, watch } from 'vue';
import { useProfileStore } from './profile.store';
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
  useProfileFeaturesClient,
} from '@lyvely/interface';
import { useGlobalDialogStore } from '@/core';

export const useProfileFeatureStore = defineStore('profile-feature-store', () => {
  const featureStateMap = new Map<string, Ref<boolean>>();
  const { profile } = storeToRefs(useProfileStore());

  watch(profile, reset);

  function reset() {
    featureStateMap.clear();
  }

  function getFeatureState(featureId: string): Ref<boolean> {
    let state = featureStateMap.get(featureId);
    if (state) return state;

    const featureConfig = useAppConfigStore().getModuleConfig<IFeatureConfig>(FEATURE_MODULE_ID);
    state = ref(isEnabledProfileFeature(featureId, profile.value!, featureConfig));
    featureStateMap.set(featureId, state);
    return state;
  }

  function isFeatureEnabled(featureId: string): boolean {
    return getFeatureState(featureId).value;
  }

  function isFeaturesEnabled(featureIds: string | string[]): boolean {
    const ids = Array.isArray(featureIds) ? featureIds : [featureIds];
    return ids.reduce((result, featureId) => result && isFeatureEnabled(featureId), true);
  }

  async function setFeatureState(featureId: string, state: boolean): Promise<void> {
    const feature = getFeature(featureId);

    if (!feature) return;

    const currentState = getFeatureState(featureId);
    currentState.value = state;

    const affectedModules = getAffectedFeatures(feature, state);
    affectedModules.forEach((feature) => _setState(feature.id, state));

    try {
      const { disabled, enabled } = await useProfileFeaturesClient().updateState(
        new UpdateFeatureModel({ featureId, state })
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
    const state = getFeatureState(featureId);
    state.value = enabled;
  }

  function getSettingFeaturesOfProfile(): IFeature[] {
    const featureConfig = useAppConfigStore().getModuleConfig<IFeatureConfig>(FEATURE_MODULE_ID);
    return getProfileFeaturesWithSettings(profile.value!, featureConfig);
  }

  return {
    isFeatureEnabled,
    isFeaturesEnabled,
    setFeatureEnabled: setFeatureState,
    getSettingFeaturesOfProfile,
  };
});
