<script lang="ts" setup>
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { ref } from 'vue';

const profileStore = useProfileStore();
const name = ref(profileStore.profile?.name);
const description = ref(profileStore.profile?.description);

//function rename() {}
</script>

<template>
  <div class="bg-main flex flex-col p-4 rounded shadow-sm mb-2 border border-divide">
    <div class="flex items-center mb-2 flex-row items-stretch">
      <div class="w-full">
        <ly-input-text v-model="name" label="profiles.settings.general.name" />
      </div>
      <div
        class="ml-3 bg-highlight w-20 flex justify-center items-center rounded border border-divide cursor-pointer">
        <ly-profile-avatar class="m-3" />
      </div>
    </div>

    <div class="w-full relative">
      <ly-input-textarea v-model="description" label="profiles.settings.description" />
    </div>

    <div class="clear-both mt-4">
      <ly-button class="primary float-right">
        {{ $t('common.update') }}
      </ly-button>
    </div>
  </div>

  <div class="bg-main p-4 rounded shadow-sm mb-4 flex flex-col border border-divide">
    <div>
      <ly-button
        class="danger float-right"
        :confirm="{ text: 'profiles.settings.archive.confirm' }">
        {{ $t('common.archive') }}
      </ly-button>
    </div>
  </div>
</template>

<style scoped></style>
