<script lang="ts" setup>
import CenteredLayoutContainer from "@/modules/ui/components/layout/CenteredLayoutContainer.vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import LyFormModel from "@/modules/ui/components/form/FormModel.vue";
import { useLoginStore } from "@/modules/users/store/login.store";
import LanguageChooser from "@/modules/ui/components/i18n/LanguageChooser.vue";

const loginStore = useLoginStore();
const router = useRouter();

const { loginModel, validator } = storeToRefs(loginStore);

async function submit() {
  loginStore.login().then((success) => {
    if (success) {
      router.replace({ path: "/" });
    }
  });
}
</script>

<template>
  <div class="w-full absolute px-2">
    <LanguageChooser class="float-right" />
  </div>

  <centered-layout-container>
    <template #title>
      <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-6" />
      <span class="text-base font-bold">{{ $t("users.login.sign_in") }}</span>
    </template>

    <template #body>
      <ly-form-model
        id="login"
        v-model="loginModel"
        :validator="validator"
        :status="loginStore.status"
        label-key="users.login.fields"
        class="mb-4"
        @keyup.enter="submit"
      >
        <ly-input-text property="email" :autocomplete="true" :required="true" />
        <ly-input-text property="password" type="password" :required="true" />
      </ly-form-model>

      <ly-form-model id="remember-me" v-model="loginModel">
        <div
          class="flex justify-center items-center justify-between clearfix pb-2"
        >
          <ly-input-checkbox
            property="remember"
            class="text-sm"
            label="users.login.remember_me"
          />
          <a
            href="#"
            class="float-right align-center no-underline font-bold text-xs"
          >
            {{ $t("users.login.forgot_password") }}
          </a>
        </div>
      </ly-form-model>
    </template>

    <template #footer>
      <ly-button
        class="primary w-full"
        :submit="true"
        :loading="loginStore.status.isStatusLoading()"
        @click="submit"
      >
        {{ $t("users.login.sign_in") }}
      </ly-button>

      <!-- Register buttons -->
      <div class="text-center pt-4">
        <small>
          {{ $t("users.login.not_a_member") }}
          <router-link to="/register" class="no-underline font-bold">
            {{ $t("user_registration.sign_up") }}
          </router-link>
        </small>
      </div>
    </template>
  </centered-layout-container>
</template>

<style scoped></style>
