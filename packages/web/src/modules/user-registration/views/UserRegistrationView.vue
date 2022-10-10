<script lang="ts" setup>
import CenteredLayoutContainer from "@/modules/ui/components/layout/CenteredLayoutContainer.vue";
import { useUserRegistrationStore } from "@/modules/user-registration/stores/user-registration.store";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { PATH_VERIFY_EMAIL } from "../routes";
import { useVerifyEmailStore } from "@/modules/user-registration/stores/verify-email.store";
import LanguageChooser from "@/modules/ui/components/i18n/LanguageChooser.vue";
import { onBeforeUnmount } from "vue";

const userRegistrationStore = useUserRegistrationStore();
const verifyEmailStore = useVerifyEmailStore();
const router = useRouter();

const { model, validator } = storeToRefs(userRegistrationStore);
const { status } = userRegistrationStore;

async function register() {
  userRegistrationStore.register().then(() => {
    if (verifyEmailStore.isAwaiting()) {
      router.push(PATH_VERIFY_EMAIL);
    }
  });
}

onBeforeUnmount(() => {
  userRegistrationStore.reset();
});
</script>

<template>
  <div class="w-full absolute px-2">
    <LanguageChooser class="float-right" />
  </div>

  <centered-layout-container>
    <template #title>
      <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-6" />
      <span class="text-base font-bold">
        {{ $t("user_registration.sign_up") }}
      </span>
    </template>

    <template #body>
      <ly-form-model
        id="user-registration"
        v-model="model"
        :validator="validator"
        :status="status"
        label-key="user_registration.fields"
      >
        <ly-input-text property="username" :required="true" />
        <ly-input-text property="email" type="email" :required="true" />
        <ly-input-text
          name="new-password"
          property="password"
          type="password"
          :required="true"
        />
        <ly-input-text
          property="passwordRepeat"
          type="password"
          :required="true"
        />
      </ly-form-model>
    </template>

    <template #footer>
      <ly-button
        class="primary w-full mb-4 float-right"
        text="user_registration.create_account"
        :disabled="status.isStatusLoading()"
        @click="register"
      />

      <div class="text-center pt-4">
        <small>
          {{ $t("user_registration.is_member") }}
          <router-link to="/login" class="no-underline font-bold">
            {{ $t("users.login.sign_in") }}
          </router-link>
        </small>
      </div>
    </template>
  </centered-layout-container>
</template>

<style scoped></style>
