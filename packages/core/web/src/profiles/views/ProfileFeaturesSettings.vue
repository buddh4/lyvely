<script lang="ts" setup>
import { t } from '@/i18n';
import { useProfileFeatureStore } from '@/profiles/stores/profile-feature.store';
import ProfileFeatureSettingsEntry from '@/profiles/components/features/ProfileFeatureSettingsEntry.vue';
import { computed, ref } from 'vue';
import { IFeature, hasDependency, hasSubFeatures } from '@lyvely/core-interface';

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
    <div class="">
      <div class="p-5">
        <ly-dimmed class="text-xs">
          Here you can enable or disable certain profile features. Note that in most cases disabling
          a feature will not remove any of the data related with a feature but rather hide features
          in menus and and other parts of the application. If disabling or enabling a certain
          feature has any side effects, you will be asked for confirmation.
        </ly-dimmed>
      </div>

      <ly-responsive>
        <ly-table class="border-collapse">
          <template #head>
            <tr>
              <th scope="col" class="px-3 py-2 md:px-5 md:py-3">
                {{ t('profiles.settings.features.name') }}
              </th>
              <th scope="col" class="px-3 py-2 md:px-5 md:py-3">
                <!-- {{ t('profiles.settings.features.actions') }} -->
              </th>
              <th scope="col" class="px-3 py-2 md:p-4"></th>
            </tr>
          </template>
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
    </div>
  </ly-content-panel>
</template>

<style scoped></style>
