<script lang="ts" setup>
import { useUserRegistrationStore } from '../stores';
import { storeToRefs } from 'pinia';
import { t } from '@/i18n';
import { onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { PATH_VERIFY_EMAIL } from '../user-registration.constants';
import { isTouchScreen, LyCenteredPanel } from '@lyvely/ui';
import { useAppConfigStore } from '@/app-config/app-config.store';
import { useDebounceFn } from '@vueuse/core';
import {
  IUserRegistrationAppConfig,
  USER_REGISTRATION_MODULE_ID,
  UserRegistrationMode,
  FieldValidationException,
} from '@lyvely/interface';

const userRegistrationStore = useUserRegistrationStore();
const registrationMode = useAppConfigStore().getModuleConfig<
  IUserRegistrationAppConfig,
  UserRegistrationMode
>(USER_REGISTRATION_MODULE_ID, 'registrationMode');

const router = useRouter();
const { model, validator } = storeToRefs(userRegistrationStore);
model.value.inviteToken = router.currentRoute.value.query?.invite as string;
model.value.email = router.currentRoute.value.query?.email as string;
const { status } = userRegistrationStore;
const showRememberInfo = ref(false);
const repeatPasswordType = ref('password');

if (
  !registrationMode ||
  registrationMode === 'none' ||
  (registrationMode === 'invite' && !model.value.inviteToken)
) {
  router.push('/login');
}

async function register() {
  return userRegistrationStore.register().then((success) => {
    if (success) {
      router.push(PATH_VERIFY_EMAIL);
    }
  });
}

onUnmounted(userRegistrationStore.reset);

const usernameLoading = ref(false);
const validateUserName = () => {
  usernameLoading.value = true;
  validateUserDebounced();
};

const validateUserDebounced = useDebounceFn(() => {
  usernameLoading.value = true;
  userRegistrationStore
    .validateUsername()
    .catch((err) => {
      if (err instanceof FieldValidationException) {
        validator.value.setError(
          'username',
          err.getFirstError('user-registration.username.invalid'),
        );
      } else {
        validator.value.setError('username', 'user-registration.username.invalid');
      }
    })
    .finally(() => (usernameLoading.value = false));
}, 800);

const emailLoading = ref(false);
const validateEmail = () => {
  emailLoading.value = true;
  validateEmailDebounced();
};

const validateEmailDebounced = useDebounceFn(() => {
  userRegistrationStore
    .validateEmail()
    .catch((err) => {
      if (err instanceof FieldValidationException) {
        validator.value.setError('email', err.getFirstError('user-registration.email.invalid'));
      } else {
        validator.value.setError('email', 'user-registration.email.invalid');
      }
    })
    .finally(() => (emailLoading.value = false));
}, 800);

const hidePassword = ref(true);
</script>

<template>
  <ly-centered-panel title="user-registration.sign_up">
    <template #body>
      <ly-form-model
        id="user-registration"
        v-model="model"
        :validator="validator"
        :status="status"
        label-key="user-registration.fields">
        <fieldset>
          <ly-text-field
            autocomplete="username"
            property="username"
            :auto-validation="false"
            :required="true"
            :autofocus="!isTouchScreen()"
            :loading="usernameLoading"
            @input="validateUserName"
            @focusout="validateUserName" />

          <ly-text-field
            autocomplete="email"
            :auto-validation="false"
            property="email"
            type="email"
            :required="true"
            :loading="emailLoading"
            @input="validateEmail"
            @focusout="validateEmail" />
        </fieldset>

        <fieldset>
          <ly-text-field
            v-model:hide="hidePassword"
            name="new-password"
            autocomplete="new-password"
            property="password"
            type="password"
            :required="true"
            @toggle-type="repeatPasswordType = $event" />

          <ly-text-field
            v-model:hide="hidePassword"
            property="passwordRepeat"
            autocomplete="new-password"
            :type="repeatPasswordType"
            :password-toggle="false"
            :required="true" />

          <ly-password-strength-meter v-model="model.password" />
        </fieldset>

        <fieldset class="my-5">
          <div class="flex flex-nowrap items-center">
            <ly-checkbox property="remember" class="text-sm" aria-describedby="remember-me-info" />
            <ly-icon
              name="info"
              class="text-primary ml-1 w-4 cursor-pointer"
              aria-hidden="true"
              @click="showRememberInfo = !showRememberInfo" />
          </div>
          <ly-alert
            v-show="showRememberInfo"
            id="remember-me-info"
            class="mt-2 text-xs"
            type="info">
            <p class="mb-1">{{ t('auth.remember_me_info.p1') }}</p>
            <p>{{ t('auth.remember_me_info.p2') }}</p>
          </ly-alert>
        </fieldset>
      </ly-form-model>
    </template>

    <template #footer>
      <ly-button
        class="primary float-right mb-4 w-full"
        text="user-registration.create_account"
        :disabled="status.isStatusLoading()"
        data-id="btn-submit"
        @click="register" />

      <div class="pt-4 text-center">
        <small>
          {{ t('user-registration.is_member') }}
          <router-link to="/login" class="font-bold no-underline">
            {{ t('user-registration.to_sign_in') }}
          </router-link>
        </small>
      </div>
    </template>
  </ly-centered-panel>
</template>

<style scoped></style>
