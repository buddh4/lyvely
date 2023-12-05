import { computed } from 'vue';
import { useProfileFeatureStore } from '@/profiles';

/**
 * Composable for reactive feature switches.
 *
 * @param features
 */
export const useFeatures = (...features: Array<string>) => {
  const profileFeatureStore = useProfileFeatureStore();
  const isEnabled = computed(() =>
    features.reduce(
      (result, featureId) => result && profileFeatureStore.isFeatureEnabled(featureId),
      true,
    ),
  );

  return { isEnabled };
};
