<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useVerifyEmailStore } from '@/user-accounts/stores/verify-email.store';
import OtpInput from '@/user-accounts/components/OtpInput.vue';
import { onUnmounted } from 'vue';
import { useFlashStore } from '@/ui';

const verifyEmailStore = useVerifyEmailStore();
const { verifyEmail, resendOtp, reset } = verifyEmailStore;
const { showModal, model, validator, errorMsg, otpInfo } = storeToRefs(verifyEmailStore);

onUnmounted(reset);
</script>

<template>
  <ly-modal
    v-model="showModal"
    title="user-accounts.my-account.verify_email.title"
    @submit="verifyEmail">
    <otp-input
      v-model="model.otp"
      :has-error="!!validator.getError('otp') || !!errorMsg"
      :email="model.emailOrUsername" />
    <ly-alert type="danger" :message="errorMsg" />

    <template #footer>
      <div class="flex justify-center space-x-1">
        <ly-button class="secondary" text="common.resend" @click="resendOtp" />
        <ly-button
          v-if="!otpInfo?.requiresRefresh()"
          class="primary"
          text="common.submit"
          @click="verifyEmail" />
      </div>
    </template>
  </ly-modal>
</template>

<style scoped></style>
