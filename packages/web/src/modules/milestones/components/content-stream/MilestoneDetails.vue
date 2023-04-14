<script lang="ts" setup>
import {
  CalendarPlanFilter,
  MilestoneModel,
  MilestoneRelationModel,
  MilestoneRelationsStore,
  toTimingId,
} from '@lyvely/common';
import ContentDetails from '@/modules/content-stream/components/ContentDetails.vue';
import { computed, onBeforeMount, ref } from 'vue';
import { useCalendarPlanStore } from '@/modules/calendar-plan';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import ProgressBar from '@/modules/ui/components/progress/ProgressBar.vue';
import { isDefined } from 'class-validator';
import { useMilestonePlanService } from '@/modules/milestones/services/milestone-plan-service';
import TextTrimmed from '@/modules/ui/components/text/TextTrimmed.vue';
import { contentRoute, getContentTypeOptions } from '@/modules/content-stream';
import { useRouter } from 'vue-router';
import LyIcon from '@/modules/ui/components/icon/UIIcon.vue';
import LyAlert from '@/modules/ui/components/alert/AlertBlock.vue';

export interface IProps {
  model: MilestoneModel;
}

const props = defineProps<IProps>();

const milestoneStore = ref(new MilestoneRelationsStore());
const calendarPlanStore = useCalendarPlanStore();
const { locale } = storeToRefs(useProfileStore());
const router = useRouter();

const progress = computed(() => {
  const tid = toTimingId(calendarPlanStore.date, props.model.interval, locale.value);
  return milestoneStore.value.calculateProgress(props.model, tid);
});

const relations = computed(() => {
  const tid = toTimingId(calendarPlanStore.date, props.model.interval, locale.value);
  return milestoneStore.value.getRelations(props.model, tid);
});

function onRelationClick(model: MilestoneRelationModel) {
  router.push(contentRoute(model.pid, model.cid));
}

function getIcon(model: MilestoneRelationModel) {
  return getContentTypeOptions(model.contentType)?.icon;
}

onBeforeMount(async () => {
  const result = await useMilestonePlanService().getByFilter(
    new CalendarPlanFilter(new Date(), props.model.interval, {
      cid: props.model.id,
    }),
  );

  milestoneStore.value.setModels(result.models);
  milestoneStore.value.setRelations(result.relations);
});
</script>

<template>
  <content-details :model="model">
    <template #image>
      <div class="flex justify-center rounded-full border border-divide w-8 h-8 bg-main">
        <router-link :to="{ name: 'Milestones' }">
          <ly-icon name="target" class="text-main" />
        </router-link>
      </div>
    </template>
    <template #body>
      <progress-bar :progress="progress" />
      <p class="my-4 text-sm">
        {{ model.content.text }}
      </p>
      <table v-if="relations.length" class="border-collapse table-auto text-xs">
        <thead>
          <tr>
            <th
              class="border-b dark:border-slate-600 p-4 pl-2 pr-4 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left"></th>
            <th
              class="border-b dark:border-slate-600 p-4 pl-2 pr-4 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
              {{ $t('milestones.details.relation') }}
            </th>
            <th
              class="border-b dark:border-slate-600 p-4 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-center">
              {{ $t('milestones.details.progress') }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-800">
          <tr
            v-for="relation in relations"
            class="cursor-pointer hover:bg-highlight"
            @click="onRelationClick(relation)">
            <td class="border-b dark:border-divide p-4 pl-2 text-left">
              <ly-icon v-if="getIcon(relation)" :name="getIcon(relation)" />
            </td>
            <td class="border-b border-divide p-4 pl-2 text-left">
              <span class="font-bold">
                <text-trimmed
                  :max="20"
                  :text="relation.title || relation.text || relation.contentType" />
              </span>
            </td>
            <td class="border-b w-40 border-divide p-4 pl-8 text-slate-500 text-center">
              <progress-bar v-if="isDefined(relation.progress)" :progress="relation.progress" />
              <span v-else>-</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="w-fit">
        <span class="text-xs">{{ $t('milestones.messages.no_relations') }}</span>
      </div>
    </template>
  </content-details>
</template>

<style scoped></style>
