<script lang="ts" setup>
import CenteredLayoutContainer from "@/modules/ui/components/layout/CenteredLayoutContainer.vue";
import { useVerifyEmailStore } from "@/modules/user-registration/stores/verify-email.store";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import OtpInput from "@/modules/auth/components/OtpInput.vue";

const verifyEmailStore = useVerifyEmailStore();
const { email } = storeToRefs(verifyEmailStore);
email.value = 'test@test.de';

const otp = ref('');
const isValidOtp = ref(false);
</script>

<template>
  <centered-layout-container>
    <template #title>
      <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-6" />
      {{ $t("user_registration.verify_email.title") }}
    </template>

    <template #body>
      <OtpInput v-model="otp" v-model:is-valid="isValidOtp" :email="email" />
    </template>

    <template #footer>
      <div class="flex justify-center space-x-1">
        <ly-button :disabled="!isValidOtp" class="secondary" text="common.resend" />
        <ly-button :disabled="!isValidOtp" class="primary" text="common.submit" />
      </div>
    </template>
  </centered-layout-container>
</template>

<style scoped></style>
