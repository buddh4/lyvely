<script lang="ts" setup>
import { useCreateProfileStore } from "@/modules/profile/stores/create-profile.store";
import { storeToRefs } from 'pinia';

const createProfileStore = useCreateProfileStore();
const { show } = storeToRefs(createProfileStore);

const model = {
  name: ''
}

</script>

<template >
  <Modal v-model="show" title="profile.create.title">
      <TextInput v-model="model.name" label="Name" :required="true" />
  </Modal>
</template>

<style scoped>

</style>
