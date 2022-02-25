<script lang="ts" setup>
import ActivityFilterNavigation from "@/modules/activity/components/ActivityFilterNavigation.vue";
import JournalList from "@/modules/journal/components/JournalList.vue";
import { CalendarPlanEnum } from "lyvely-common";
import TimingList from "@/modules/timing/components/TimingList.vue";
import Loader from "@/modules/ui/components/loader/Loader.vue";
import EditJournalModal from "@/modules/journal/components/EditJournalModal.vue";
import { EditJournalDto, IJournal } from "lyvely-common";
import { useJournalStore } from '@/modules/journal/store';
import { useProfileStore } from '@/modules/user/store/profile.store';
import { computed } from 'vue';

function created() {
  useJournalStore().loadJournals();
}

function createEditModel(model: IJournal): EditJournalDto {
    const { profile } = useProfileStore();
    return EditJournalDto.createEdit(
      model,
      profile?.name || ''
    );
  }

function createInitialModel(profile: string): EditJournalDto {
    return EditJournalDto.createInitialModel(profile);
}

function getPlans() {
  return [CalendarPlanEnum.Daily];
}

const loaded = computed(() => useJournalStore().isStatusSuccess())
</script>

<template>
  <ActivityFilterNavigation />

  <TimingList v-if="loaded">
    <JournalList
      v-for="plan in plans"
      :key="plan"
      :plan="plan"
      @edit="setEditModel($event)"
      @archive="archiveModel($event)"
    />
  </TimingList>
  <Loader v-else />

  <EditJournalModal
    v-if="loaded"
    v-model="createModalOpened"
    v-model:model="createModel"
    :create="true"
  />

  <EditJournalModal
    v-if="loaded"
    v-model="editModalOpened"
    v-model:model="editModel"
  />

  <a class="btn-add" @click="createModalOpened = true">+</a>
</template>



<style scoped></style>
