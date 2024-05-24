<script lang="ts" setup>
import CaptchaInput from '@/captcha/components/CaptchaInput.vue';
import { LyCenteredPanel, isTouchScreen } from '@lyvely/ui';
import { useSendResetPasswordMailStore, useResetPasswordStore } from '../stores';
import { storeToRefs } from 'pinia';
import { useRouter, RouteLocationRaw } from 'vue-router';
import { PATH_LOGIN } from '../auth.constants';
import { t } from '@/i18n';
import { onUnmounted, ref } from 'vue';

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
        id="send-mail"
        v-model="sendMailModel"
        :validator="sendMailValidator"
        :status="sendResetPasswordMailStore.status"
        label-key="auth.reset_password.fields"
        @keydown.enter="sendMail">
        <ly-text-field
          property="usernameOrEmail"
          autocomplete="email"
          :required="true"
          :autofocus="!isTouchScreen()" />
        <captcha-input id="reset-password-captcha" ref="captchaInput" />
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

      <div class="mt-4 text-right">
        <router-link :to="loginRoute" data-id="to-login" class="items-center text-xs">
          {{ t('auth.reset_password.to_login') }}
        </router-link>
      </div>
    </template>
  </ly-centered-panel>

  <ly-centered-panel v-if="stage === 'sent'" title="auth.reset_password.sent.title" width="sm">
    <template #body>
      <p class="text-sm">
        {{ t('auth.reset_password.sent.text') }}
      </p>
    </template>

    <template #footer>
      <ly-button
        class="primary float-right"
        data-id="to-login"
        text="auth.reset_password.to_login"
        @click="toLogin" />
    </template>
  </ly-centered-panel>

  <ly-centered-panel v-if="stage === 'reset'" title="auth.reset_password.title" width="sm">
    <template #body>
      <ly-form-model
        id="reset-password"
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
          data-id="btn-submit"
          class="primary ml-auto"
          :loading="resetPasswordStore.status.isStatusLoading()"
          text="auth.reset_password.submit_reset"
          @click="resetPassword" />
      </div>

      <div class="mt-4 text-right">
        <router-link :to="loginRoute" class="items-center text-xs">
          {{ t('auth.reset_password.to_login') }}
        </router-link>
      </div>
    </template>
  </ly-centered-panel>
</template>
