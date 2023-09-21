<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';
import { useMilestonesStore } from '@/modules/milestones/stores/milestones.store';
import { ContentModel, MilestoneModel } from '@lyvely/common';
import MilestoneChooser from '@/modules/milestones/components/menus/MilestoneChooser.vue';
import { translate } from '@/i18n';

interface IProps {
  content: ContentModel;
  editable?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  editable: false,
});

const mid = computed(() => props.content.meta.mid);

const isLoaded = ref(!mid.value);
const milestone = ref<MilestoneModel | null>(null);
const isMilestone = computed(() => props.content.type === MilestoneModel.contentType);

const milestoneTitle = computed(() => {
  return milestone.value ? milestone.value.getTitle() : translate('common.none');
});

watchEffect(() => {
  if (!mid.value) return;

  isLoaded.value = false;

  useMilestonesStore()
    .loadMilestone(mid.value)
    .then((model) => {
      milestone.value = model;
    })
    .finally(() => {
      isLoaded.value = true;
    });
}, {});

// TODO accessibility
</script>

<template>
  <ly-dropdown v-if="!isMilestone">
    <template #trigger="{ toggle }">
      <div
        :class="[
          'flex items-center gap-1 rounded border border-divide text-xs px-1.5 py-1 relative',
          { ' cursor-pointer': editable },
        ]"
        @click="toggle">
        <span>{{ $t('milestones.name') }}: </span>
        <span v-if="isLoaded" class="font-bold">{{ milestoneTitle }}</span>
        <ly-loader v-else size="1em" />
        <ly-icon v-if="isLoaded && editable" name="caret-down" />
      </div>
    </template>

    <template #default>
      <suspense>
        <milestone-chooser :content="content" />
        <template #fallback>
          <div class="w-32">
            <ly-loader />
          </div>
        </template>
      </suspense>
    </template>
  </ly-dropdown>
</template>

<style scoped></style>
