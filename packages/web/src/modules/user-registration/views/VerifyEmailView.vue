<script lang="ts" setup>
import CenteredLayoutContainer from "@/modules/ui/components/layout/CenteredLayoutContainer.vue";
import { useVerifyEmailStore } from "@/modules/user-registration/stores/verify-email.store";
import { storeToRefs } from "pinia";
import { onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";
import OtpInput from "@/modules/auth/components/OtpInput.vue";

const verifyEmailStore = useVerifyEmailStore();
const { model, errorMsg, attempts } = storeToRefs(verifyEmailStore);
const router = useRouter();

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

const isValidOtp = ref(false);
onBeforeUnmount(verifyEmailStore.reset);
</script>

<template>
  <centered-layout-container>
    <template #title>
      <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-6" />
      {{ $t("user_registration.verify_email.title") }}
    </template>

    <template #body>
      <OtpInput
        v-model="model.otp"
        v-model:is-valid="isValidOtp"
        :has-error="!!errorMsg?.length"
        :email="model.email"
      />

      <ly-alert :message="errorMsg" />
    </template>

    <template #footer>
      <div class="flex justify-center space-x-1">
        <ly-button class="secondary" text="common.resend" @click="resend" />
        <ly-button
          v-if="attempts !== 0"
          :disabled="!isValidOtp"
          class="primary"
          text="common.submit"
          @click="verifyEmail"
        />
      </div>
    </template>
  </centered-layout-container>
</template>

<style scoped></style>
