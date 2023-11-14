<script lang="ts" setup>
import { useVerifyRegistrationEmailStore } from '../stores';
import { storeToRefs } from 'pinia';
import { onUnmounted } from 'vue';
import OtpInput from '@/user-accounts/components/OtpInput.vue';
import { LyCenteredPanel } from '@lyvely/ui';

const verifyEmailStore = useVerifyRegistrationEmailStore();
const { model, errorMsg, validator, otpInfo } = storeToRefs(verifyEmailStore);
const { resendOtp } = verifyEmailStore;

if (!model.value.emailOrUsername) {
  document.location = '/';
}

function verifyEmail() {
  verifyEmailStore.verifyEmail().then((success) => {
    if (success) {
      document.location = '/?help=1';
    }
  });
}

onUnmounted(verifyEmailStore.reset);
</script>

<template>
  <ly-centered-panel title="user-registrations.verify_email.title">
    <template #body>
      <otp-input
        v-model="model.otp"
        :has-error="!!validator.getError('otp') || !!errorMsg"
        :email="model.emailOrUsername" />
      <ly-alert type="danger" :text="errorMsg" />
    </template>

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
  </ly-centered-panel>
</template>

<style scoped></style>
