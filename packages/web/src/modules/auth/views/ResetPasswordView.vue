<script lang="ts" setup>
import LanguageChooser from '@/modules/i18n/components/LanguageChooser.vue';
import CenteredLayoutContainer from '@/modules/ui/components/layout/CenteredLayoutContainer.vue';
import { useSendResetPasswordMailStore } from '@/modules/auth/store/send-reset-password-mail.store';
import { storeToRefs } from 'pinia';
import { useRouter, RouteLocationRaw } from 'vue-router';
import { PATH_LOGIN } from '@/modules/auth';
import { onUnmounted, ref } from 'vue';
import { useResetPasswordStore } from '@/modules/auth/store/reset-password.store';
import PasswordStrengthMeter from '@/modules/ui/components/form/PasswordStrengthMeter.vue';
import LyInputCheckbox from '@/modules/ui/components/form/CheckboxInput.vue';

const resetPasswordStore = useResetPasswordStore();
const sendResetPasswordMailStore = useSendResetPasswordMailStore();
const {
  model: resetModel,
  validator: resetValidator,
  stage,
  status: resetStatus,
  token,
} = storeToRefs(resetPasswordStore);
const {
  model: sendMailModel,
  validator: sendMailValidator,
  status: sendMailStatus,
} = storeToRefs(sendResetPasswordMailStore);
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
  <div class="w-full absolute px-2">
    <LanguageChooser class="float-right" />
  </div>

  <centered-layout-container v-if="stage === 'init'" width="lg">
    <template #title>
      <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-6" />
      <span class="text-base font-bold">
        {{ $t('auth.reset_password.title') }}
      </span>
    </template>

    <template #body>
      <ly-form-model
        v-model="sendMailModel"
        :validator="sendMailValidator"
        :status="sendMailStatus"
        label-key="auth.reset_password.fields"
      >
        <ly-input-text property="email" autocomplete="email" autofocus />
        <ly-input-captcha ref="captchaInput" />
      </ly-form-model>
    </template>

    <template #footer>
      <div class="flex items-center">
        <ly-button
          class="primary ml-auto"
          :loading="sendResetPasswordMailStore.status.isStatusLoading()"
          text="auth.reset_password.submit_send"
          @click="sendMail"
        />
      </div>

      <div class="text-right mt-4">
        <router-link :to="loginRoute" class="items-center text-xs">
          {{ $t('auth.reset_password.to_login') }}
        </router-link>
      </div>
    </template>
  </centered-layout-container>

  <centered-layout-container v-if="stage === 'sent'" width="sm">
    <template #title>
      <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-6" />
      <span class="text-base font-bold">
        {{ $t('auth.reset_password.sent.title') }}
      </span>
    </template>

    <template #body>
      <p class="text-sm">
        {{ $t('auth.reset_password.sent.text') }}
      </p>
    </template>

    <template #footer>
      <ly-button class="primary float-right" text="auth.reset_password.to_login" @click="toLogin" />
    </template>
  </centered-layout-container>

  <centered-layout-container v-if="stage === 'reset'" width="sm">
    <template #title>
      <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-6" />
      <span class="text-base font-bold">
        {{ $t('auth.reset_password.title') }}
      </span>
    </template>

    <template #body>
      <ly-form-model
        v-model="resetModel"
        :validator="resetValidator"
        :status="resetStatus"
        label-key="auth.reset_password.fields"
      >
        <fieldset>
          <ly-input-text
            name="new-password"
            autocomplete="new-password"
            property="password"
            type="password"
            :required="true"
            @toggle-type="repeatPasswordType = $event"
          />

          <ly-input-text
            property="passwordRepeat"
            autocomplete="new-password"
            :type="repeatPasswordType"
            :password-toggle="false"
            :required="true"
          />
          <password-strength-meter v-model="resetModel.password" />
        </fieldset>

        <ly-input-checkbox property="resetSessions" />
      </ly-form-model>
    </template>

    <template #footer>
      <div class="flex items-center">
        <ly-button
          class="primary ml-auto"
          :loading="resetPasswordStore.status.isStatusLoading()"
          text="auth.reset_password.submit_reset"
          @click="resetPassword"
        />
      </div>

      <div class="text-right mt-4">
        <router-link :to="loginRoute" class="items-center text-xs">
          {{ $t('auth.reset_password.to_login') }}
        </router-link>
      </div>
    </template>
  </centered-layout-container>
</template>
