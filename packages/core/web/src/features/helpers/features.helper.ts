import { useProfileStore } from '@/profiles';
import { useAppConfigStore } from '@/app-config';
import {
  FEATURE_MODULE_ID,
  IFeatureConfig,
  isEnabledProfileFeature,
  getFeaturesWithSettings,
  IFeature,
} from '@lyvely/core-interface';

export function isFeatureEnabledOnProfile(feature: string): boolean {
  const profile = useProfileStore().profile;
  const featureConfig = useAppConfigStore().getModuleConfig<IFeatureConfig>(FEATURE_MODULE_ID);
  return isEnabledProfileFeature(feature, profile!, featureConfig);
}

export function getSettingFeaturesOfProfile(): IFeature[] {
  const profile = useProfileStore().profile;
  const featureConfig = useAppConfigStore().getModuleConfig<IFeatureConfig>(FEATURE_MODULE_ID);
  return getFeaturesWithSettings(profile!, featureConfig);
}
