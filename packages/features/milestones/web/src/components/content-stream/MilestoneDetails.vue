<script lang="ts" setup>
import {
  MilestoneModel,
  MilestoneRelationModel,
  MilestoneRelationsStore,
} from '@lyvely/milestones-interface';
import { CalendarPlanFilter, useCalendarPlanStore } from '@lyvely/calendar-plan-web';
import { toTimingId } from '@lyvely/dates';
import {
  ContentDetails,
  useProfileStore,
  contentRoute,
  getContentTypeOptions,
  t,
} from '@lyvely/web';
import { computed, onBeforeMount, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMilestonePlanService } from '@/services';
import { useRouter } from 'vue-router';
import { LyIcon, LyProgressBar, LyTrim, LyMarkdownView } from '@lyvely/ui';

export interface IProps {
  model: MilestoneModel;
}

const props = defineProps<IProps>();

const profileStore = useProfileStore();
const milestoneStore = ref(new MilestoneRelationsStore());
const calendarPlanStore = useCalendarPlanStore();
const { locale } = storeToRefs(profileStore);
const router = useRouter();

const progress = computed(() => {
  const tid = toTimingId(
    calendarPlanStore.date,
    props.model.interval,
    locale.value,
    profileStore.getSetting('calendar'),
  );
  return milestoneStore.value.calculateProgress(props.model, tid);
});

const relations = computed(() => {
  const tid = toTimingId(
    calendarPlanStore.date,
    props.model.interval,
    locale.value,
    profileStore.getSetting('calendar'),
  );
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
      <ly-progress-bar :progress="progress" />
      <p class="my-4 text-sm">
        <ly-markdown-view :md="model.content.text" class="text-sm" />
      </p>
      <table v-if="relations.length" class="border-collapse table-auto text-xs">
        <tbody>
          <tr
            v-for="relation in relations"
            :key="relation.cid"
            class="cursor-pointer hover:bg-highlight"
            @click="onRelationClick(relation)">
            <td class="px-4 py-2 pl-2 text-left">
              <ly-icon v-if="getIcon(relation)" :name="getIcon(relation)" />
            </td>
            <td class="px-4 py-2 pl-2 text-left">
              <span class="font-bold">
                <ly-trim
                  :max="20"
                  :text="relation.title || relation.text || relation.contentType" />
              </span>
            </td>
            <td class="w-40 px-4 py-2 pl-8 text-center">
              <ly-progress-bar
                v-if="typeof relation.progress !== 'undefined'"
                :progress="relation.progress" />
              <span v-else>-</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="w-fit">
        <span class="text-xs">{{ t('milestones.messages.no_relations') }}</span>
      </div>
    </template>
  </content-details>
</template>

<style scoped></style>
