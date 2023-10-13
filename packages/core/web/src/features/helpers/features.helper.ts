import { useProfileStore } from '@/profiles';
import { useAppConfigStore } from '@/app-config';
import { FEATURE_MODULE_ID, IFeatureConfig, isEnabledProfileFeature } from '@lyvely/core-interface';

export function isFeatureEnabledOnProfile(feature: string) {
  const profile = useProfileStore().profile;
  const featureConfig = useAppConfigStore().getModuleConfig<IFeatureConfig>(FEATURE_MODULE_ID);
  return isEnabledProfileFeature(e.feature, profile!, featureConfig);
}
