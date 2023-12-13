<script setup lang="ts">
import { t } from '@/i18n';
import { IFeature } from '@lyvely/interface';
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
  get: () => profileFeatureStore.isFeatureEnabled(props.feature.id),
  set: (enabled: boolean) => profileFeatureStore.setFeatureEnabled(props.feature.id, enabled),
});

const isMainFeature = !props.feature.dependencies?.length;

const padding = 'py-2 md:py-4';
</script>

<template>
  <tr
    :class="[
      { 'border-b border-divide last:border-0': !isSelected },
      { 'bg-gray-50 dark:bg-gray-700': isSelected },
      { 'border-r border-gray-60 dark:border-gray-700': !isMainFeature },
    ]">
    <th
      scope="row"
      :class="['p-0', { 'cursor-pointer': hasSubFeatures }]"
      @click="hasSubFeatures ? $emit('toggle', feature) : ''">
      <div
        :class="[
          `${padding} border-divide`,
          { 'border-gray-60 dark:border-gray-700': !isMainFeature },
        ]"
        :style="{ 'border-left-width': !isMainFeature ? '20px' : '0px' }">
        <div class="flex items-center">
          <div :class="{ 'cursor-pointer': hasSubFeatures }">
            {{ t(feature.title) }}
          </div>
          <button v-if="hasSubFeatures">
            <ly-icon :name="isSelected ? 'caret-down' : 'caret-right'" />
          </button>
        </div>
        <ly-dimmed v-if="feature.description" class="text-xs" :text="feature.description" />
      </div>
    </th>
    <td :class="`flex items-center ${padding} space-x-3 p-0`">
      <ly-button
        v-if="feature.configurable"
        class="primary text-xs"
        title="profiles.settings.features.configure">
        <ly-icon name="settings" class="w-3.5" />
      </ly-button>
    </td>
    <td :class="`w-4 ${padding}`">
      <div class="flex items-center"><ly-checkbox v-model="isEnabled" /></div>
    </td>
  </tr>
</template>

<style scoped></style>
