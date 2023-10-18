<script setup lang="ts">
import { t } from '@/i18n';
import { IFeature } from '@lyvely/core-interface';
import { computed } from 'vue';
import { useProfileFeatureStore } from '@/profiles/stores/profile-feature.store';

interface IProps {
  feature: IFeature;
}

const profileFeatureStore = useProfileFeatureStore();
const props = defineProps<IProps>();

const isEnabled = computed({
  get: () => profileFeatureStore.isFeatureEnabled(props.feature.id).value,
  set: (enabled: boolean) => profileFeatureStore.setFeatureEnabled(props.feature.id, enabled),
});
</script>

<template>
  <tr class="border-b border-divide hover:bg-gray-50 dark:hover:bg-gray-600">
    <th scope="row" class="px-3 py-2 md:px-5 md:py-4 font-medium whitespace-nowrap">
      {{ t(feature.title) }}
      <ly-dimmed v-if="feature.description" class="text-xs" :text="feature.description" />
    </th>
    <td class="flex items-center px-3 py-2 md:px-5 md:py-4 space-x-3">
      <ly-button class="primary text-xs" title="profiles.settings.features.configure">
        <ly-icon name="settings" class="w-3.5" />
      </ly-button>
    </td>
    <td class="w-4 p-4">
      <div class="flex items-center">
        <ly-checkbox v-model="isEnabled" />
      </div>
    </td>
  </tr>
</template>

<style scoped></style>
