<script lang="ts" setup>
import CenteredLayoutContainer from "@/modules/ui/components/layout/CenteredLayoutContainer.vue";
import { useVerifyEmailStore } from "@/modules/user-registration/stores/verify-email.store";
import { storeToRefs } from "pinia";
import LyIcon from "@/modules/ui/components/icon/UIIcon.vue";
import LyTextDimmed from "@/modules/ui/components/text/TextDimmed.vue";

const verifyEmailStore = useVerifyEmailStore();
const { awaiting, email } = storeToRefs(verifyEmailStore);
</script>

<template>
  <centered-layout-container v-if="awaiting">
    <template #title>
      <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-6" />
      {{ $t("user_registration.verify_email_title") }}
    </template>
    <template #body>
      <div class="text-center">
        <ly-icon name="envelop" class="w-16 text-pop m-2" />
      </div>

      <i18n-t
        keypath="user_registration.verify_email_text"
        tag="p"
        class="text-center text-dimmed mb-5"
      >
        <template #email>
          <b>{{ email }}</b>
        </template>
      </i18n-t>

      <ly-text-dimmed class="text-sm text-center">
        {{ $t("user_registration.verify_email_subtext") }}
      </ly-text-dimmed>
    </template>
  </centered-layout-container>
</template>

<style scoped></style>
