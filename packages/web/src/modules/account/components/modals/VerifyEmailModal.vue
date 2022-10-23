<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useVerifyEmailStore } from "@/modules/account/stores/verify-email.store";
import OtpInput from "@/modules/auth/components/OtpInput.vue";

const addEmailStore = useVerifyEmailStore();
const { verifyEmail } = addEmailStore;
const { showModal, model, status, validator } = storeToRefs(addEmailStore);
</script>

<template>
  <ly-modal
    v-model="showModal"
    title="account.my_account.verify_email.title"
    @submit="verifyEmail"
  >
    <otp-input
      v-model="model.otp"
      :has-error="validator.hasErrors()"
      :email="model.email"
    />
  </ly-modal>
</template>

<style scoped></style>
