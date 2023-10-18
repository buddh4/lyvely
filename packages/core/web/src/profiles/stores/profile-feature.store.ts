import { defineStore, storeToRefs } from 'pinia';
import { ref, Ref, watch } from 'vue';
import { useProfileStore } from '@/profiles';
import { useAppConfigStore } from '@/app-config';
import {
  IFeature,
  IFeatureConfig,
  FEATURE_MODULE_ID,
  isEnabledProfileFeature,
  getProfileFeaturesWithSettings,
} from '@lyvely/core-interface';

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

  function setFeatureEnabled(featureId: string, enabledState: boolean): void {
    const state = isFeatureEnabled(featureId);
    state.value = enabledState;
    profile.value!.disabledFeatures.push(featureId);
  }

  function getSettingFeaturesOfProfile(): IFeature[] {
    const featureConfig = useAppConfigStore().getModuleConfig<IFeatureConfig>(FEATURE_MODULE_ID);
    return getProfileFeaturesWithSettings(profile.value!, featureConfig);
  }

  return {
    isFeatureEnabled,
    setFeatureEnabled,
    getSettingFeaturesOfProfile,
  };
});
