<script lang="ts" setup>
import CaptchaInput from '@/captcha/components/CaptchaInput.vue';
import { LyCenteredPanel, isTouchScreen } from '@lyvely/ui';
import { useSendResetPasswordMailStore } from '@/auth/store/send-reset-password-mail.store';
import { storeToRefs } from 'pinia';
import { useRouter, RouteLocationRaw } from 'vue-router';
import { PATH_LOGIN } from '@/auth';
import { onUnmounted, ref } from 'vue';
import { useResetPasswordStore } from '@/auth/store/reset-password.store';

const resetPasswordStore = useResetPasswordStore();
const sendResetPasswordMailStore = useSendResetPasswordMailStore();
const { model: resetModel, validator: resetValidator, stage } = storeToRefs(resetPasswordStore);
const { model: sendMailModel, validator: sendMailValidator } = storeToRefs(
  sendResetPasswordMailStore,
);
const router = useRouter();
const loginRoute = { path: PATH_LOGIN };
const captchaInput = ref();
const repeatPasswordType = ref('password');

function sendMail() {
  sendResetPasswordMailStore.sendResetPasswordMail();
}

function resetPassword() {
  resetPasswordStore.resetPassword().then((route?: RouteLocationRaw) => {
    if (route) {
      router.replace(route);
    }
  });
}

function toLogin() {
  router.replace(loginRoute);
}

onUnmounted(() => sendResetPasswordMailStore.reset());
</script>

<template>
  <ly-centered-panel v-if="stage === 'init'" title="auth.reset_password.title" width="lg">
    <template #body>
      <ly-form-model
        v-model="sendMailModel"
        :validator="sendMailValidator"
        :status="sendResetPasswordMailStore.status"
        label-key="auth.reset_password.fields">
        <ly-text-field property="email" autocomplete="email" :autofocus="!isTouchScreen()" />
        <captcha-input ref="captchaInput" />
      </ly-form-model>
    </template>

    <template #footer>
      <div class="flex items-center">
        <ly-button
          class="primary ml-auto"
          :loading="sendResetPasswordMailStore.status.isStatusLoading()"
          text="auth.reset_password.submit_send"
          @click="sendMail" />
      </div>

      <div class="text-right mt-4">
        <router-link :to="loginRoute" class="items-center text-xs">
          {{ $t('auth.reset_password.to_login') }}
        </router-link>
      </div>
    </template>
  </ly-centered-panel>

  <ly-centered-panel v-if="stage === 'sent'" title="auth.reset_password.sent.title" width="sm">
    <template #body>
      <p class="text-sm">
        {{ $t('auth.reset_password.sent.text') }}
      </p>
    </template>

    <template #footer>
      <ly-button class="primary float-right" text="auth.reset_password.to_login" @click="toLogin" />
    </template>
  </ly-centered-panel>

  <ly-centered-panel v-if="stage === 'reset'" title="auth.reset_password.title" width="sm">
    <template #body>
      <ly-form-model
        v-model="resetModel"
        :validator="resetValidator"
        :status="resetPasswordStore.status"
        label-key="auth.reset_password.fields">
        <fieldset>
          <ly-text-field
            name="new-password"
            autocomplete="new-password"
            property="password"
            type="password"
            :required="true"
            @toggle-type="repeatPasswordType = $event" />

          <ly-text-field
            property="passwordRepeat"
            autocomplete="new-password"
            :type="repeatPasswordType"
            :password-toggle="false"
            :required="true" />
          <ly-password-strength-meter v-model="resetModel.password" />
        </fieldset>

        <ly-checkbox property="resetSessions" />
      </ly-form-model>
    </template>

    <template #footer>
      <div class="flex items-center">
        <ly-button
          class="primary ml-auto"
          :loading="resetPasswordStore.status.isStatusLoading()"
          text="auth.reset_password.submit_reset"
          @click="resetPassword" />
      </div>

      <div class="text-right mt-4">
        <router-link :to="loginRoute" class="items-center text-xs">
          {{ $t('auth.reset_password.to_login') }}
        </router-link>
      </div>
    </template>
  </ly-centered-panel>
</template>
