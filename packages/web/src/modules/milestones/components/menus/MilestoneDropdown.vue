<script lang="ts" setup>
import { computed, onBeforeMount, ref, watch } from 'vue';
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

const isLoaded = ref(!props.content.meta.mid);
const milestone = ref<MilestoneModel | null>(null);

const milestoneTitle = computed(() => {
  return milestone.value ? milestone.value.getTitle() : translate('common.none');
});

watch(
  props.content.meta.mid,
  () => {
    if (!props.content.meta.mid) return;

    isLoaded.value = false;

    useMilestonesStore()
      .loadMilestone(props.content.meta.mid)
      .then((model) => {
        milestone.value = model;
      })
      .finally(() => {
        isLoaded.value = true;
      });
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <ly-dropdown>
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
