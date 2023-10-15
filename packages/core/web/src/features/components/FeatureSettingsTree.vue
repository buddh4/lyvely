<script lang="ts" setup>
import { ref, computed, WritableComputedRef } from 'vue';
import { IFeature } from '@lyvely/core-interface';
import { isFeatureEnabledOnProfile } from '../helpers';
import { useCreateProfileStore, useProfileStore } from '@/profiles';

interface IProps {
  features: IFeature[];
  intend?: number;
}

const { profile } = useProfileStore();

const props = withDefaults(defineProps<IProps>(), {
  intend: 0,
});

interface IFeatureTableEntry {
  feature: IFeature;
  level: number;
  parent: string;
}

function customSort(objects: IFeature[]): IFeature[] {
  const sortedObjects: IFeature[] = [...objects];

  // Define a custom sorting function
  sortedObjects.sort((a, b) => {
    const getIdParts = (id: string) => id.split('.');
    const aIdParts = getIdParts(a.id);
    const bIdParts = getIdParts(b.id);

    for (let i = 0; i < Math.min(aIdParts.length, bIdParts.length); i++) {
      if (aIdParts[i] < bIdParts[i]) return -1;
      if (aIdParts[i] > bIdParts[i]) return 1;
    }

    return aIdParts.length - bIdParts.length;
  });

  return sortedObjects;
}

const sortedFeatures = customSort(props.features);

const enabledStates = sortedFeatures.reduce((state, feature) => {
  state[feature.id] = computed({
    get: () => isFeatureEnabledOnProfile(feature.id),
    set: (isEnabled: boolean) =>
      isEnabled
        ? profile!.enabledFeatures.push(feature.id)
        : profile!.disabledFeatures.push(feature.id),
  });
  return state;
}, {} as Record<string, WritableComputedRef<boolean>>);
</script>

<template>
  <div>
    {{ profile!.enabledFeatures }}
    {{ profile!.disabledFeatures }}
    <table class="border-collapse table-auto text-xs">
      <thead>
        <tr>
          <th></th>
          <th>{{ $t('features.settings.name') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="feature in sortedFeatures" :key="feature.id">
          <td><ly-input-checkbox v-model="enabledStates[feature.id]" /></td>
          <td>{{ $t(feature.title) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
