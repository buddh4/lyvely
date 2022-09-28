<script lang="ts" setup>
import { Status } from "@/store/status";
import CenteredLayoutContainer from "@/modules/ui/components/layout/CenteredLayoutContainer.vue";
import { useAuthStore } from "../store/auth.store";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const router = useRouter();
const input = reactive({ username: "", password: "" });

const isLoginErrorState = computed(() => authStore.status === Status.ERROR);
const { statusError } = storeToRefs(authStore);

async function login() {
  authStore.resetStatus();
  if (!validate()) return;

  if (await authStore.login(input.username, input.password)) {
    await router.replace({ path: "/" });
  }
}

const userNameError = ref("");
const passwordError = ref("");

function validate(): boolean {
  passwordError.value = "";
  userNameError.value = "";

  if (input.username && input.password) {
    return true;
  }

  if (!input.password) {
    passwordError.value = "Password is required.";
  }

  if (!input.username) {
    userNameError.value = "Username is required.";
  }

  return false;
}
</script>

<template>
  <centered-layout-container title="users.labels.sign_in">
    <form class="min-w-max" novalidate>
      <!-- Email input -->
      <div class="mb-4">
        <ly-input-text
          id="login-username"
          v-model="input.username"
          :error="userNameError"
          label="users.labels.username"
          :required="true"
        ></ly-input-text>
      </div>

      <!-- Password input -->
      <div class="mb-4">
        <ly-input-text
          id="login-password"
          v-model="input.password"
          :error="passwordError"
          label="users.labels.password"
          :required="true"
          type="password"
        ></ly-input-text>
      </div>

      <!-- 2 column grid layout for inline styling -->
      <div
        class="flex justify-center items-center justify-between clearfix pb-2"
      >
        <ly-input-checkbox label="users.labels.remember_me"></ly-input-checkbox>
        <small class="float-right align-center">
          <a href="#" class="no-underline">
            {{ $t("users.labels.forgot_password") }}
          </a>
        </small>
      </div>

      <ly-alert
        v-if="isLoginErrorState"
        :message="statusError"
        data-login-error
        class="danger my-2"
      />

      <ly-button class="primary w-full" :submit="true" @click="login">
        {{ $t("users.labels.sign_in") }}
      </ly-button>
    </form>

    <!-- Register buttons -->
    <div class="text-center pt-4">
      <small>
        {{ $t("users.texts.not_a_member") }}
        <router-link to="/register" class="no-underline">
          {{ $t("users.labels.sign_up") }}
        </router-link>
      </small>
    </div>
  </centered-layout-container>
</template>

<style scoped></style>
