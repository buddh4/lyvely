<script lang="ts" setup>
import { useVerifyRegistrationEmailStore } from '@/user-registration/stores/verify-email.store';
import { storeToRefs } from 'pinia';
import { onUnmounted } from 'vue';
import OtpInput from '@/auth/components/OtpInput.vue';
import { LyCenteredPanel } from '@lyvely/ui';

const verifyEmailStore = useVerifyRegistrationEmailStore();
const { model, errorMsg, validator, otpInfo } = storeToRefs(verifyEmailStore);
const { resendOtp } = verifyEmailStore;

if (!model.value.email) {
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
  <ly-centered-panel>
    <template #title>
      <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-6" />
      {{ $t('user_registration.verify_email.title') }}
    </template>

    <template #body>
      <otp-input
        v-model="model.otp"
        :has-error="!!validator.getError('otp') || !!errorMsg"
        :email="model.email" />
      <ly-alert type="danger" :message="errorMsg" />
    </template>

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
  </ly-centered-panel>
</template>

<style scoped></style>
