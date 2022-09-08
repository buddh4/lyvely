<script lang="ts" setup>

import TextInput from "@/modules/ui/components/form/TextInput.vue";
import { ref } from 'vue';
import Textarea from "@/modules/ui/components/form/Textarea.vue";
import Button from "@/modules/ui/components/button/Button.vue";

const name = ref('');
const description = ref('')

</script>

<template>

  <div class="bg-main flex flex-col p-4 rounded shadow-lg mb-4">
    <TextInput v-model="name" label="profile.settings.user.name" />
    <Textarea v-model="description" label="profile.settings.user.description"/>
    <div>
      <Button class="primary float-right">{{ $t('common.update') }}</Button>
    </div>

  </div>

  <div class="bg-main p-4 rounded shadow-lg mb-4 flex flex-col">
    <div>
      <Button class="danger float-right" :confirm="{'text': 'profile.settings.archive.confirm'}">{{ $t('profile.settings.user.archive') }}</Button>
    </div>
  </div>
</template>

<style scoped></style>
