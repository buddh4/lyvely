<script lang="ts" setup>
import CenteredLayoutContainer from "@/modules/ui/components/layout/CenteredLayoutContainer.vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { watch, onBeforeUnmount, ref } from "vue";
import LyFormModel from "@/modules/ui/components/form/FormModel.vue";
import { useLoginStore } from "@/modules/auth/store/login.store";
import LanguageChooser from "@/modules/i18n/components/LanguageChooser.vue";
import LyIcon from "@/modules/ui/components/icon/UIIcon.vue";
import LyAlert from "@/modules/ui/components/alert/AlertBlock.vue";
import { RequiresEmailVerificationException } from "@/modules/auth/exceptions/RequiresEmailVerificationException";

const loginStore = useLoginStore();
const router = useRouter();
const showRememberInfo = ref(false);
import { RouteLocationRaw } from "vue-router";

const { loginModel, validator, stage } = storeToRefs(loginStore);

watch(stage, () => {
  // When moving between stages we want to clear the errors
  loginStore.status.resetStatus();
});

async function next() {
  if (stage.value === "email") {
    return toPasswordStage();
  } else {
    return submit();
  }
}

async function submit() {
  loginStore.login().then((route: RouteLocationRaw|false) => {
    if (route) {
      router.replace(route);
    }
  });
}

async function toPasswordStage() {
  if (await validator.value.validateField("email")) {
    stage.value = "password";
  }
}

onBeforeUnmount(loginStore.reset);

/**
 * @see https://www.chromium.org/developers/design-documents/form-styles-that-chromium-understands/
 */
</script>

<template>
  <div class="w-full absolute px-2">
    <LanguageChooser class="float-right" />
  </div>

  <centered-layout-container>
    <template #title>
      <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-6" />
      <span class="text-base font-bold">{{ $t("users.login.sign_in") }}</span>
    </template>

    <template #body>
      <ly-form-model
        id="login"
        v-model="loginModel"
        :validator="validator"
        :auto-validation="false"
        :status="loginStore.status"
        :show-alert="false"
        label-key="users.login.fields"
        @keydown.enter="next"
      >
        <div v-if="stage === 'email'">
          <ly-input-text
            property="email"
            autocomplete="username"
            :autofocus="true"
            :required="true"
          />
          <ly-alert :message="loginStore.status.statusError" />
        </div>

        <div v-if="stage === 'password'">
          <div class="flex items-center justify-center mb-5">
            <div
              class="flex items-center border border-divide rounded-full px-2 py-1 text-sm font-bold cursor-pointer"
              @click="stage = 'email'"
            >
              <ly-icon name="user" class="mr-1" />
              <span>{{ loginModel.email }}</span>
            </div>
          </div>

          <ly-input-text
            autocomplete="username"
            wrapper-class="hidden"
            aria-hidden="true"
            property="email"
            :autofocus="true"
            :required="true"
          />

          <ly-input-text
            name="current-password"
            property="password"
            type="password"
            :autofocus="true"
            :required="true"
          />

          <ly-alert :message="loginStore.status.statusError" />
          <div class="flex items-center justify-between">
            <div class="flex flex-nowrap items-center mt-1">
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
            <a
              v-if="stage === 'password'"
              class="no-underline font-bold text-xs"
            >
              {{ $t("users.login.forgot_password") }}
            </a>
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
        </div>
      </ly-form-model>
    </template>

    <template #footer>
      <div v-if="stage === 'email'">
        <ly-button
          v-if="stage === 'email'"
          class="primary w-full"
          @click="toPasswordStage"
        >
          {{ $t("common.next") }}
        </ly-button>

        <div class="text-center mt-4">
          <small>
            {{ $t("users.login.not_a_member") }}
            <router-link to="/register" class="no-underline font-bold">
              {{ $t("user_registration.sign_up") }}
            </router-link>
          </small>
        </div>
      </div>

      <ly-button
        v-if="stage === 'password'"
        class="primary w-full"
        form="login"
        :loading="loginStore.status.isStatusLoading()"
        @click="submit"
      >
        {{ $t("users.login.sign_in") }}
      </ly-button>
    </template>
  </centered-layout-container>
</template>
