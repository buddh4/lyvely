<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useVerifyEmailStore } from '@/modules/account/stores/verify-email.store';
import OtpInput from '@/modules/auth/components/OtpInput.vue';
import { onUnmounted } from 'vue';

const verifyEmailStore = useVerifyEmailStore();
const { verifyEmail, resendOtp, reset } = verifyEmailStore;
const { showModal, model, validator, errorMsg, otpInfo } = storeToRefs(verifyEmailStore);

onUnmounted(reset);
</script>

<template>
  <ly-modal v-model="showModal" title="account.my_account.verify_email.title" @submit="verifyEmail">
    <otp-input
      v-model="model.otp"
      :has-error="!!validator.getError('otp') || !!errorMsg"
      :email="model.email" />
    <ly-alert :message="errorMsg" />

    <template #footer>
      <div class="flex justify-center space-x-1">
        <ly-button class="secondary" label="common.resend" @click="resendOtp" />
        <ly-button
          v-if="!otpInfo?.requiresRefresh()"
          class="primary"
          label="common.submit"
          @click="verifyEmail" />
      </div>
    </template>
  </ly-modal>
</template>

<style scoped></style>
