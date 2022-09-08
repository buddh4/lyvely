<script lang="ts" setup>

import TextInput from "@/modules/ui/components/form/TextInput.vue";
import { ref } from 'vue';
import Textarea from "@/modules/ui/components/form/Textarea.vue";
import Button from "@/modules/ui/components/button/Button.vue";
import UserAvatar from "@/modules/user/components/UserAvatar.vue";

const displayName = ref('');
const description = ref('');

</script>

<template>

  <div class="bg-main flex flex-col p-4 rounded shadow-sm mb-2 border border-divide">
    <div class="flex items-center mb-2 flex-row items-stretch">
      <div class="w-full relative">
        <Button class="absolute right-0.5 bottom-0.5 text-xs z-10">{{ $t('common.restore') }}</Button>
        <TextInput v-model="displayName" class="mb-0" label="profile.settings.user.displayName" />
      </div>
      <div class="ml-3 bg-highlight w-20 flex justify-center items-center rounded border border-divide cursor-pointer">
        <UserAvatar class="m-3" />
      </div>
    </div>

    <div class="w-full relative">
      <Textarea v-model="description" label="profile.settings.user.description"/>
      <Button class="absolute right-2 bottom-2 text-xs">{{ $t('common.restore') }}</Button>
    </div>

    <div>
      <Button class="primary float-right">{{ $t('common.update') }}</Button>
    </div>
  </div>

  <div class="bg-main p-4 rounded shadow-sm mb-4 flex flex-col border border-divide">
    <div>
      <Button class="danger float-right" :confirm="{'text': 'profile.settings.archive.confirm'}">{{ $t('profile.settings.user.archive') }}</Button>
    </div>
  </div>
</template>

<style scoped></style>
