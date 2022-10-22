<script lang="ts" setup>
import LanguageChooser from "@/modules/i18n/components/LanguageChooser.vue";
import CenteredLayoutContainer from "@/modules/ui/components/layout/CenteredLayoutContainer.vue";
import { usePasswordResetStore } from "@/modules/auth/store/password-reset.store";
import { storeToRefs } from "pinia";

const passwordResetStore = usePasswordResetStore();
const { email, captcha } = storeToRefs(passwordResetStore);
</script>

<template>
  <div class="w-full absolute px-2">
    <LanguageChooser class="float-right" />
  </div>

  <centered-layout-container width="lg">
    <template #title>
      <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-6" />
      <span class="text-base font-bold">
        {{ $t("auth.forgot_password.title") }}
      </span>
    </template>

    <template #body>
      <ly-input-text
        v-model="email"
        label="auth.forgot_password.fields.email"
      />
      <ly-input-captcha v-model="captcha" purpose="password-reset" />
    </template>

    <template #footer></template>
  </centered-layout-container>
</template>
