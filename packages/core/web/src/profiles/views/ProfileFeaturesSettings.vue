<script lang="ts" setup>
import { t } from '@/i18n';
import { useProfileFeatureStore } from '@/profiles/stores/profile-feature.store';
import ProfileFeatureSettingsEntry from '@/profiles/components/features/ProfileFeatureSettingsEntry.vue';
import { computed, ref } from 'vue';
import { IFeature, hasDependency, hasSubFeatures } from '@lyvely/interface';
import { LyListPageSection } from '@lyvely/ui';

const allFeatures = useProfileFeatureStore().getSettingFeaturesOfProfile();
const mainFeatures = allFeatures.filter((feature) => !feature.dependencies?.length);

const selectedMainFeature = ref<string>();
const displayFeatures = computed(() => {
  if (!selectedMainFeature.value) return mainFeatures;
  return allFeatures.filter(
    (feature) => !feature.dependencies?.length || hasDependency(feature, selectedMainFeature.value!)
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

const showInfo = ref(false);
</script>

<template>
  <ly-list-page title="profiles.settings.features.headline" aria-label="tags.view.aria.title">
    <template #header-right>
      <ly-button @click="showInfo = !showInfo">
        <ly-icon name="info" class="info" />
      </ly-button>
    </template>
    <ly-list-page-section v-if="showInfo" class="bg-blue-100 dark:bg-blue-500">
      <p class="text-sm">
        {{ t('profiles.settings.features.info') }}
      </p>
    </ly-list-page-section>
    <ly-list-page-section>
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
    </ly-list-page-section>
  </ly-list-page>
</template>

<style scoped></style>
