<script lang="ts" setup>
import CenteredLayoutContainer from "@/modules/ui/components/layout/CenteredLayoutContainer.vue";
import { useVerifyRegistrationEmailStore } from "@/modules/user-registration/stores/verify-email.store";
import { storeToRefs } from "pinia";
import { onUnmounted } from "vue";
import OtpInput from "@/modules/auth/components/OtpInput.vue";

const verifyEmailStore = useVerifyRegistrationEmailStore();
const { model, errorMsg, attempts, validator, otpInfo } =
  storeToRefs(verifyEmailStore);

if (!model.value.email) {
  document.location = "/";
}

function resend() {
  verifyEmailStore.resend();
}

function verifyEmail() {
  verifyEmailStore.verifyEmail().then((success) => {
    if (success) {
      document.location = "/";
    }
  });
}

onUnmounted(verifyEmailStore.reset);
</script>

<template>
  <centered-layout-container>
    <template #title>
      <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-6" />
      {{ $t("user_registration.verify_email.title") }}
    </template>

    <template #body>
      <otp-input
        v-model="model.otp"
        :has-error="!!validator.getError('otp') || !!errorMsg"
        :email="model.email"
      />
      <ly-alert :message="errorMsg" />
    </template>

    <template #footer>
      <div class="flex justify-center space-x-1">
        <ly-button class="secondary" text="common.resend" @click="resend" />
        <ly-button
          v-if="!otpInfo?.requiresRefresh()"
          class="primary"
          text="common.submit"
          @click="verifyEmail"
        />
      </div>
    </template>
  </centered-layout-container>
</template>

<style scoped></style>
