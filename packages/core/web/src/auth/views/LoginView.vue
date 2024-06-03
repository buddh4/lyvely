<script lang="ts" setup>
import { RouteLocationRaw, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { t } from '@/i18n';
import { onUnmounted, ref, watch } from 'vue';
import { useLoginStore, useSendResetPasswordMailStore, useAuthStore } from '../stores';
import { isTouchScreen, LyCenteredPanel } from '@lyvely/ui';
import { useAppConfigStore } from '@/app-config/app-config.store';
import {
  IUserRegistrationAppConfig,
  USER_REGISTRATION_MODULE_ID,
  UserRegistrationMode,
} from '@lyvely/interface';
import { PATH_SIGN_UP } from '@/user-registration/user-registration.constants';
import { profileRoot } from '@/profiles/routes/profile-route.helper';
import { STACK_CENTERED_LAYOUT_LINKS } from '@/ui';

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
  if (stage.value === 'usernameOrEmail') {
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
  if (await validator.value.validateField('usernameOrEmail')) {
    stage.value = 'password';
  }
}

function setResetPassword() {
  useSendResetPasswordMailStore().setUsernameOrEmail(loginModel.value.usernameOrEmail);
}

const isVisitorModeEnabled = useAuthStore().isVisitorModeEnabled();
const accessAsVisitor = () => {
  router.push(profileRoot());
};

onUnmounted(loginStore.reset);

/**
 * @see https://www.chromium.org/developers/design-documents/form-styles-that-chromium-understands/
 */
</script>

<template>
  <ly-centered-panel title="auth.login.sign_in">
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
        <div v-if="stage === 'usernameOrEmail'">
          <ly-text-field
            property="usernameOrEmail"
            autocomplete="username"
            :autofocus="!isTouchScreen()"
            :required="true" />
          <ly-alert type="danger" :text="loginStore.status.statusError" />
        </div>

        <div v-if="stage === 'password'">
          <div class="mb-5 flex items-center justify-center">
            <div
              class="flex cursor-pointer items-center rounded-full border border-divide px-2 py-1 text-sm font-bold"
              @click="stage = 'usernameOrEmail'">
              <ly-icon name="user" class="mr-1" />
              <span>{{ loginModel.usernameOrEmail }}</span>
            </div>
          </div>

          <ly-text-field
            autocomplete="username"
            wrapper-class="hidden"
            aria-hidden="true"
            property="usernameOrEmail"
            :required="true" />

          <ly-text-field
            name="current-password"
            property="password"
            type="password"
            :autofocus="!isTouchScreen()"
            :required="true" />

          <ly-alert type="danger" :text="loginStore.status.statusError" />

          <div class="flex cursor-pointer items-center justify-between">
            <div class="mt-1 flex flex-nowrap items-center">
              <ly-checkbox
                property="remember"
                class="text-sm"
                aria-describedby="remember-me-info" />
              <ly-icon
                name="info"
                class="ml-1 w-4 cursor-pointer text-primary"
                aria-hidden="true"
                @click="showRememberInfo = !showRememberInfo" />
            </div>
            <router-link
              v-if="stage === 'password'"
              :to="{ name: 'ResetPassword' }"
              data-id="reset-password"
              class="cursor-pointer text-xs font-bold no-underline"
              @click="setResetPassword">
              {{ t('auth.login.reset_password') }}
            </router-link>
          </div>

          <ly-alert
            v-show="showRememberInfo"
            id="remember-me-info"
            class="mt-2 text-xs"
            type="info">
            <p class="mb-1">{{ t('auth.remember_me_info.p1') }}</p>
            <p>{{ t('auth.remember_me_info.p2') }}</p>
          </ly-alert>
        </div>
      </ly-form-model>
    </template>

    <template #footer>
      <div v-if="stage === 'usernameOrEmail'">
        <ly-button data-id="btn-to-password" class="primary w-full" @click="toPasswordStage">
          {{ t('common.next') }}
        </ly-button>

        <div v-if="isPublicRegistration" class="mt-4 text-center">
          <small>
            {{ t('auth.login.not_a_member') }}
            <router-link :to="PATH_SIGN_UP" class="font-bold no-underline">
              {{ t('auth.login.to_sign_up') }}
            </router-link>
          </small>
        </div>

        <div class="relative mt-5 flex flex-col gap-2 border-t border-divide pt-4">
          <div class="absolute top-0 flex w-full justify-center" style="margin-top: -0.5em">
            <div class="inline-block bg-main px-2 text-xs font-bold uppercase text-dimmed">or</div>
          </div>
          <ly-button
            v-if="isVisitorModeEnabled"
            class="secondary flex w-full items-center justify-center gap-2 text-white"
            @click="accessAsVisitor()">
            <ly-icon name="guest" />
            <div class="inline-block min-w-[6rem]">
              {{ t('auth.login.visitor') }}
            </div>
          </ly-button>
          <ly-button class="flex w-full items-center justify-center gap-2 bg-red-500 text-white">
            <ly-icon name="google" />
            <div class="inline-block min-w-[6rem]">Google</div>
          </ly-button>
          <ly-button class="flex w-full items-center justify-center gap-2 bg-gray-600 text-white">
            <ly-icon name="github" />
            <div class="inline-block min-w-[6rem]">Github</div>
          </ly-button>
          <ly-button class="flex w-full items-center justify-center gap-2 bg-blue-700 text-white">
            <ly-icon name="facebook" />
            <div class="inline-block min-w-[6rem]">Facebook</div>
          </ly-button>
        </div>
      </div>

      <ly-button
        v-if="stage === 'password'"
        data-id="btn-login"
        class="primary w-full"
        form="login"
        :loading="loginStore.status.isStatusLoading()"
        @click="submit">
        {{ t('auth.login.sign_in') }}
      </ly-button>
    </template>
    <template #links>
      <ly-component-stack :id="STACK_CENTERED_LAYOUT_LINKS" />
    </template>
  </ly-centered-panel>
</template>
