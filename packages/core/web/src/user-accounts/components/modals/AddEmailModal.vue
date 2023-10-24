<script lang="ts" setup>
import { useAddEmailStore } from '@/user-accounts/stores/add-email.store';
import { storeToRefs } from 'pinia';

const addEmailStore = useAddEmailStore();
const { addEmail } = addEmailStore;
const { showModal, model, status, validator } = storeToRefs(addEmailStore);
</script>

<template>
  <ly-modal v-model="showModal" title="user-accounts.my-account.add_email.title" @submit="addEmail">
    <ly-form-model
      v-model="model"
      label-key="user-accounts.my-account.add_email.fields"
      :status="status"
      :validator="validator">
      <ly-text-field type="email" property="email" />
    </ly-form-model>
  </ly-modal>
</template>

<style scoped></style>
