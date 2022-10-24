<script lang="ts" setup>
import LanguageChooser from '@/modules/i18n/components/LanguageChooser.vue';
import CenteredLayoutContainer from '@/modules/ui/components/layout/CenteredLayoutContainer.vue';
import { useSendResetPasswordMailStore } from '@/modules/auth/store/reset-password.store';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { PATH_LOGIN } from '@/modules/auth';
import { onUnmounted } from 'vue';

const sendResetPasswordMailStore = useSendResetPasswordMailStore();
const { model, validator, stage, status } = storeToRefs(sendResetPasswordMailStore);
const router = useRouter();
const loginRoute = { path: PATH_LOGIN };

function submit() {
  sendResetPasswordMailStore.sendResetPasswordMail();
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
      <ly-form-model v-model="model" :validator="validator" label-key="auth.reset_password.fields">
        <ly-input-text property="email" autocomplete="email" autofocus />
        <ly-input-captcha />
      </ly-form-model>
    </template>

    <template #footer>
      <div class="flex items-center">
        <router-link :to="loginRoute" class="flex items-center text-sm">
          {{ $t('auth.reset_password.to_login') }}
        </router-link>
        <ly-button
          class="primary ml-auto"
          :loading="sendResetPasswordMailStore.status.isStatusLoading()"
          text="auth.reset_password.submit"
          @click="submit"
        />
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
</template>
