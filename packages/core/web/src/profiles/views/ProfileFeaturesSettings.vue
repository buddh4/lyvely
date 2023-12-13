<script lang="ts" setup>
import { t } from '@/i18n';
import { useProfileFeatureStore } from '@/profiles/stores/profile-feature.store';
import ProfileFeatureSettingsEntry from '@/profiles/components/features/ProfileFeatureSettingsEntry.vue';
import { computed, ref } from 'vue';
import { IFeature, hasDependency, hasSubFeatures } from '@lyvely/interface';

const allFeatures = useProfileFeatureStore().getSettingFeaturesOfProfile();
const mainFeatures = allFeatures.filter((feature) => !feature.dependencies?.length);

const selectedMainFeature = ref<string>();
const displayFeatures = computed(() => {
  if (!selectedMainFeature.value) return mainFeatures;
  return allFeatures.filter(
    (feature) =>
      !feature.dependencies?.length || hasDependency(feature, selectedMainFeature.value!),
  );
});

const toggleSelectedFeature = (feature: IFeature) => {
  if (selectedMainFeature.value === feature.id) {
    selectedMainFeature.value = undefined;
  } else {
    selectedMainFeature.value = feature.id;
  }
};

const hasSub = (feature: IFeature) => {
  return hasSubFeatures(feature, allFeatures);
};
</script>

<template>
  <ly-content-panel>
    <div class="flex items-start gap-2">
      <ly-icon name="info" class="info w-4 md:w-6 shrink-0" />
      <ly-dimmed class="text-xs">
        {{ t('profiles.features.settings.info') }}
      </ly-dimmed>
    </div>
  </ly-content-panel>
  <ly-content-panel>
    <ly-responsive>
      <ly-table class="border-collapse">
        <template #body>
          <profile-feature-settings-entry
            v-for="feature in displayFeatures"
            :key="feature.id"
            :feature="feature"
            :has-sub-features="hasSub(feature)"
            :is-selected="feature.id === selectedMainFeature"
            @toggle="toggleSelectedFeature" />
        </template>
      </ly-table>
    </ly-responsive>
  </ly-content-panel>
</template>

<style scoped></style>
