<script lang="ts" setup>
import CenteredLayoutContainer from "@/modules/ui/components/layout/CenteredLayoutContainer.vue";
import { useUserRegistrationStore } from "@/modules/user-registration/stores/user-registration.store";
import { storeToRefs } from "pinia";
import LanguageChooser from "@/modules/i18n/components/LanguageChooser.vue";
import PasswordStrengthMeter from "@/modules/ui/components/form/PasswordStrengthMeter.vue";
import { onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";
import { useVerifyEmailStore } from "@/modules/user-registration/stores/verify-email.store";
import { PATH_VERIFY_EMAIL } from "@/modules/user-registration/routes/paths";

const userRegistrationStore = useUserRegistrationStore();

const router = useRouter();
const { model, validator } = storeToRefs(userRegistrationStore);
const { status } = userRegistrationStore;
const showRememberInfo = ref(false);
const repeatPasswordType = ref("password");

async function register() {
  return userRegistrationStore.register().then(() => {
    if(useVerifyEmailStore().email) {
      router.push(PATH_VERIFY_EMAIL);
    }
  });
}

onBeforeUnmount(userRegistrationStore.reset);
</script>

<template>
  <div class="w-full absolute px-2">
    <LanguageChooser class="float-right" />
  </div>

  <centered-layout-container>
    <template #title>
      <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-6" />
      <span class="text-base font-bold">
        {{ $t("user_registration.sign_up") }}
      </span>
    </template>

    <template #body>
      <ly-form-model
        id="user-registration"
        v-model="model"
        :validator="validator"
        :status="status"
        label-key="user_registration.fields"
      >
        <fieldset>
          <ly-input-text
            autocomplete="username"
            property="username"
            :required="true"
          />

          <ly-input-text
            autocomplete="email"
            property="email"
            type="email"
            :required="true"
          />
        </fieldset>

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
          <password-strength-meter v-model="model.password" />
        </fieldset>

        <fieldset class="my-5">
          <div class="flex flex-nowrap items-center">
            <ly-input-checkbox
              property="remember"
              class="text-sm"
              aria-describedby="remember-me-info"
            />
            <ly-icon
              name="info"
              class="ml-1 text-primary w-4 cursor-pointer"
              aria-hidden="true"
              @click="showRememberInfo = !showRememberInfo"
            />
          </div>
          <ly-alert
            v-show="showRememberInfo"
            id="remember-me-info"
            class="mt-2 text-xs"
            type="info"
          >
            <p class="mb-1">{{ $t("users.login.remember_me_info.p1") }}</p>
            <p>{{ $t("users.login.remember_me_info.p2") }}</p>
          </ly-alert>
        </fieldset>
      </ly-form-model>
    </template>

    <template #footer>
      <ly-button
        class="primary w-full mb-4 float-right"
        text="user_registration.create_account"
        :disabled="status.isStatusLoading()"
        @click="register"
      />

      <div class="text-center pt-4">
        <small>
          {{ $t("user_registration.is_member") }}
          <router-link to="/login" class="no-underline font-bold">
            {{ $t("users.login.sign_in") }}
          </router-link>
        </small>
      </div>
    </template>
  </centered-layout-container>
</template>

<style scoped></style>
