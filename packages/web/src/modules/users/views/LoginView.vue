<script lang="ts" setup>
import { Status } from "@/store/status";
import CenteredLayoutContainer from "@/modules/ui/components/layout/CenteredLayoutContainer.vue";
import { useAuthStore } from "../store/auth.store";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import LyFormModel from "@/modules/ui/components/form/FormModel.vue";
import { useLoginStore } from "@/modules/users/store/login.store";

const loginStore = useLoginStore();
const router = useRouter();

const { loginModel, validator } = storeToRefs(loginStore);

async function login() {
  if (await loginStore.login()) {
    await router.replace({ path: "/" });
  }
}

const userNameError = ref("");
const passwordError = ref("");

</script>

<template>
  <centered-layout-container>
    <template #title>
      <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-6" />
      {{ $t("users.login.sign_in") }}
    </template>

    <template #body>
      <ly-form-model id="login" v-model="loginModel" :validator="validator" :status="loginStore.status" label-key="users.login.fields" class="mb-4">
        <ly-input-text
            property="email"
            :required="true"
        />
        <ly-input-text
            property="password"
            type="password"
            :required="true"
        />
      </ly-form-model>

      <!-- 2 column grid layout for inline styling -->
      <div class="flex justify-center items-center justify-between clearfix pb-2">
        <ly-input-checkbox class="text-sm" label="users.login.remember_me" />
          <a href="#" class="float-right align-center no-underline font-bold text-xs">
            {{ $t("users.login.forgot_password") }}
          </a>
      </div>

      <ly-alert
        v-if="isLoginErrorState"
        :message="statusError"
        data-login-error
        class="danger my-2"
      />
    </template>
    <template #footer>
      <ly-button class="primary w-full" :submit="true" @click="login">
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
