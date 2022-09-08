<script lang="ts" setup>

import TextInput from "@/modules/ui/components/form/TextInput.vue";
import { ref } from 'vue';
import Textarea from "@/modules/ui/components/form/Textarea.vue";
import Button from "@/modules/ui/components/button/Button.vue";
import UserAvatar from "@/modules/user/components/UserAvatar.vue";

const displayName = ref('');
const description = ref('')

</script>

<template>

  <div class="bg-main flex flex-col p-4 rounded shadow-md mb-4">
    <div class="flex items-center mb-2 flex-row items-stretch">
      <div class="w-full">
        <TextInput v-model="displayName" label="profile.settings.user.displayName" />
      </div>
      <div class="ml-3 bg-highlight w-20 flex justify-center items-center rounded border border-divide cursor-pointer">
        <UserAvatar class="m-3" />
      </div>
    </div>

    <Textarea v-model="description" label="profile.settings.user.description"/>

    <div>
      <Button class="primary float-right">{{ $t('common.update') }}</Button>
      <Button class="secondary float-right mr-2">{{ $t('profile.settings.user.toDefault') }}</Button>
    </div>
  </div>

  <div class="bg-main p-4 rounded shadow-md mb-4 flex flex-col">
    <div>
      <Button class="danger float-right" :confirm="{'text': 'profile.settings.archive.confirm'}">{{ $t('profile.settings.user.archive') }}</Button>
    </div>
  </div>
</template>

<style scoped></style>
