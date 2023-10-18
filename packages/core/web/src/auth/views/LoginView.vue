<script lang="ts" setup>
import { useRouter, RouteLocationRaw } from 'vue-router';
import { storeToRefs } from 'pinia';
import { watch, onUnmounted, ref } from 'vue';
import { useLoginStore } from '@/auth/store/login.store';
import LanguageChooser from '@/i18n/components/LanguageChooser.vue';
import { useSendResetPasswordMailStore } from '@/auth/store/send-reset-password-mail.store';
import { isTouchScreen } from '@/ui';
import { useAppConfigStore } from '@/app-config/store/app-config.store';
import {
  USER_REGISTRATION_MODULE_ID,
  IUserRegistrationAppConfig,
  UserRegistrationMode,
} from '@lyvely/core-interface';
import { LyCenteredLayout } from '@lyvely/ui';

const loginStore = useLoginStore();
const router = useRouter();
const showRememberInfo = ref(false);

const { loginModel, validator, stage } = storeToRefs(loginStore);

const isPublicRegistration = useAppConfigStore().getModuleConfig<
  IUserRegistrationAppConfig,
  UserRegistrationMode
>(USER_REGISTRATION_MODULE_ID, 'registrationMode');

watch(stage, () => {
  // When moving between stages we want to clear the errors
  loginStore.status.resetStatus();
});

async function next() {
  if (stage.value === 'email') {
    return toPasswordStage();
  } else {
    return submit();
  }
}

async function submit() {
  loginStore.login().then((route: RouteLocationRaw | false) => {
    if (route) {
      router.replace(route);
    }
  });
}

async function toPasswordStage() {
  if (await validator.value.validateField('email')) {
    stage.value = 'password';
  }
}

function setResetPassword() {
  useSendResetPasswordMailStore().setEmail(loginModel.value.email);
}

onUnmounted(loginStore.reset);

/**
 * @see https://www.chromium.org/developers/design-documents/form-styles-that-chromium-understands/
 */
</script>

<template>
  <div class="w-full absolute px-2">
    <LanguageChooser class="float-right" />
  </div>

  <ly-centered-layout>
    <template #title>
      <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-6" />
      <span class="text-base font-bold">{{ $t('auth.login.sign_in') }}</span>
    </template>

    <template #body>
      <ly-form-model
        id="login"
        v-model="loginModel"
        :validator="validator"
        :auto-validation="false"
        :status="loginStore.status"
        :show-alert="false"
        label-key="auth.login.fields"
        @keydown.enter="next">
        <div v-if="stage === 'email'">
          <ly-text-field
            property="email"
            autocomplete="username"
            :autofocus="!isTouchScreen()"
            :required="true" />
          <ly-alert type="danger" :message="loginStore.status.statusError" />
        </div>

        <div v-if="stage === 'password'">
          <div class="flex items-center justify-center mb-5">
            <div
              class="flex items-center border border-divide rounded-full px-2 py-1 text-sm font-bold cursor-pointer"
              @click="stage = 'email'">
              <ly-icon name="user" class="mr-1" />
              <span>{{ loginModel.email }}</span>
            </div>
          </div>

          <ly-text-field
            autocomplete="username"
            wrapper-class="hidden"
            aria-hidden="true"
            property="email"
            :required="true" />

          <ly-text-field
            name="current-password"
            property="password"
            type="password"
            :autofocus="!isTouchScreen()"
            :required="true" />

          <ly-alert type="danger" :message="loginStore.status.statusError" />

          <div class="flex items-center justify-between cursor-pointer">
            <div class="flex flex-nowrap items-center mt-1">
              <ly-checkbox
                property="remember"
                class="text-sm"
                aria-describedby="remember-me-info" />
              <ly-icon
                name="info"
                class="ml-1 text-info-dark w-4 cursor-pointer"
                aria-hidden="true"
                @click="showRememberInfo = !showRememberInfo" />
            </div>
            <router-link
              v-if="stage === 'password'"
              :to="{ name: 'ResetPassword' }"
              class="no-underline font-bold text-xs cursor-pointer"
              @click="setResetPassword">
              {{ $t('auth.login.reset_password') }}
            </router-link>
          </div>

          <ly-alert
            v-show="showRememberInfo"
            id="remember-me-info"
            class="mt-2 text-xs"
            type="info">
            <p class="mb-1">{{ $t('auth.login.remember_me_info.p1') }}</p>
            <p>{{ $t('auth.login.remember_me_info.p2') }}</p>
          </ly-alert>
        </div>
      </ly-form-model>
    </template>

    <template #footer>
      <div v-if="stage === 'email'">
        <ly-button class="primary w-full" @click="toPasswordStage">
          {{ $t('common.next') }}
        </ly-button>

        <div v-if="isPublicRegistration" class="text-center mt-4">
          <small>
            {{ $t('auth.login.not_a_member') }}
            <router-link to="/register" class="no-underline font-bold">
              {{ $t('user_registration.sign_up') }}
            </router-link>
          </small>
        </div>
      </div>

      <ly-button
        v-if="stage === 'password'"
        class="primary w-full"
        form="login"
        :loading="loginStore.status.isStatusLoading()"
        @click="submit">
        {{ $t('auth.login.sign_in') }}
      </ly-button>
    </template>
  </ly-centered-layout>
</template>
