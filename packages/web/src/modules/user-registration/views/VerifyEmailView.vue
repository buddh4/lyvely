<script lang="ts" setup>
import CenteredLayoutContainer from "@/modules/ui/components/layout/CenteredLayoutContainer.vue";
import { useVerifyEmailStore } from "@/modules/user-registration/stores/verify-email.store";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import OtpInput from "@/modules/auth/components/OtpInput.vue";

const verifyEmailStore = useVerifyEmailStore();
const { model } = storeToRefs(verifyEmailStore);
const router = useRouter();

function verifyEmail() {
  verifyEmailStore.verifyEmail().then((success) => {
    if (success) {
      document.location = "/";
      //router.replace({ path: "/" });
    }
  });
}

const isValidOtp = ref(false);
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
        :email="model.email"
      />
    </template>

    <template #footer>
      <div class="flex justify-center space-x-1">
        <ly-button class="secondary" text="common.resend" />
        <ly-button
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
