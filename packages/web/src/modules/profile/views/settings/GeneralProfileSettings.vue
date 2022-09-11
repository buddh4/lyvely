<script lang="ts" setup>

import TextInput from "@/modules/ui/components/form/TextInput.vue";
import { useProfileStore } from "@/modules/profile/stores/profile.store";
import { ref } from 'vue';
import Textarea from "@/modules/ui/components/form/Textarea.vue";
import Button from "@/modules/ui/components/button/Button.vue";
import ProfileSettingsNavigation from "@/modules/profile/components/layout/ProfileSettingsNavigation.vue";
import ProfileAvatar from "@/modules/profile/components/ProfileAvatar.vue";

const profileStore = useProfileStore();
const name = ref(profileStore.profile?.name);
const description = ref(profileStore.profile?.description);

function rename() {

}
</script>

<template>

  <div class="bg-main flex flex-col p-4 rounded shadow-sm mb-2 border border-divide">
    <div class="flex items-center mb-2 flex-row items-stretch">
      <div class="w-full">
        <TextInput v-model="name" label="profile.settings.general.name" />
      </div>
      <div class="ml-3 bg-highlight w-20 flex justify-center items-center rounded border border-divide cursor-pointer">
        <ProfileAvatar class="m-3" />
      </div>
    </div>
    <Textarea v-model="description" label="profile.settings.description"/>
    <div>
      <Button class="primary float-right">{{ $t('common.update') }}</Button>
    </div>

  </div>

  <div class="bg-main p-4 rounded shadow-sm mb-4 flex flex-col border border-divide">
    <div>
      <Button class="danger float-right" :confirm="{'text': 'profile.settings.archive.confirm'}">{{ $t('common.archive') }}</Button>
    </div>
  </div>
</template>

<style scoped></style>
