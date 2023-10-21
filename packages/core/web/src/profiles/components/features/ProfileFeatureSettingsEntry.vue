<script setup lang="ts">
import { t } from '@/i18n';
import { IFeature } from '@lyvely/core-interface';
import { computed } from 'vue';
import { useProfileFeatureStore } from '@/profiles/stores/profile-feature.store';

interface IProps {
  feature: IFeature;
  hasSubFeatures?: boolean;
  isSelected?: boolean;
}

const profileFeatureStore = useProfileFeatureStore();
const props = withDefaults(defineProps<IProps>(), {
  hasSubFeatures: false,
  isSelected: false,
});

defineEmits(['toggle']);

const isEnabled = computed({
  get: () => profileFeatureStore.isFeatureEnabled(props.feature.id).value,
  set: (enabled: boolean) => profileFeatureStore.setFeatureEnabled(props.feature.id, enabled),
});
</script>

<template>
  <tr
    :class="[
      { 'border-b border-divide': !isSelected },
      { 'bg-gray-50 dark:bg-gray-700': isSelected },
      { 'border-r border-gray-60 dark:border-gray-700': !!feature.dependencies?.length },
    ]">
    <th scope="row" class="whitespace-nowrap p-0">
      <div
        :class="[
          'px-3 py-2 md:px-5 md:py-4 border-divide',
          { 'border-gray-60 dark:border-gray-700': !!feature.dependencies?.length },
        ]"
        :style="{ 'border-left-width': !!feature.dependencies?.length ? '20px' : '0px' }">
        <div class="flex items-center">
          <div :class="{ 'cursor-pointer': hasSubFeatures }" @click="$emit('toggle', feature)">
            {{ t(feature.title) }}
          </div>
          <button v-if="hasSubFeatures" class="" @click="$emit('toggle', feature)">
            <ly-icon :name="isSelected ? 'caret-down' : 'caret-right'" />
          </button>
        </div>
        <ly-dimmed v-if="feature.description" class="text-xs" :text="feature.description" />
      </div>
    </th>
    <td class="flex items-center px-3 py-2 md:px-5 md:py-4 space-x-3 p-0">
      <ly-button
        v-if="feature.configurable"
        class="primary text-xs"
        title="profiles.settings.features.configure">
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
