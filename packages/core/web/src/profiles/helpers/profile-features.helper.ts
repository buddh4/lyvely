import { useProfileStore } from '../stores';
import { useAppConfigStore } from '@/app-config';
import {
  FEATURE_MODULE_ID,
  IFeatureConfig,
  isEnabledProfileFeature,
  getProfileFeaturesWithSettings,
  IFeature,
} from '@lyvely/core-interface';
import { computed, ComputedRef } from 'vue';

export function isFeatureEnabledOnProfile(feature: string): ComputedRef<boolean> {
  return computed(() => {
    const profile = useProfileStore().profile;
    const featureConfig = useAppConfigStore().getModuleConfig<IFeatureConfig>(FEATURE_MODULE_ID);
    return isEnabledProfileFeature(feature, profile!, featureConfig);
  });
}

export function getSettingFeaturesOfProfile(): IFeature[] {
  const profile = useProfileStore().profile;
  const featureConfig = useAppConfigStore().getModuleConfig<IFeatureConfig>(FEATURE_MODULE_ID);
  return getProfileFeaturesWithSettings(profile!, featureConfig);
}
