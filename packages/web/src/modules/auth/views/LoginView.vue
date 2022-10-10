<script lang="ts" setup>
import CenteredLayoutContainer from "@/modules/ui/components/layout/CenteredLayoutContainer.vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { watch, onBeforeUnmount } from "vue";
import LyFormModel from "@/modules/ui/components/form/FormModel.vue";
import { useLoginStore } from "@/modules/auth/store/login.store";
import LanguageChooser from "@/modules/ui/components/i18n/LanguageChooser.vue";
import LyIcon from "@/modules/ui/components/icon/UIIcon.vue";

const loginStore = useLoginStore();
const router = useRouter();

const {loginModel, validator, stage} = storeToRefs(loginStore);

watch(stage, () => {
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
  loginStore.login().then((success) => {
    if (success) {
      router.replace({path: "/"});
    }
  });
}

async function toPasswordStage() {
  if (await validator.value.validateField("email")) {
    stage.value = "password";
  }
}

onBeforeUnmount(() => {
  loginStore.reset();
});
</script>

<template>
  <div class="w-full absolute px-2">
    <LanguageChooser class="float-right"/>
  </div>

  <centered-layout-container>
    <template #title>
      <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-6"/>
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
          @keyup.enter="submit"
      >
        <div v-if="stage === 'email'">
          <ly-input-text
              v-if="stage === 'email'"
              name="email"
              property="email"
              type="email"
              :autofocus="true"
              autocomplete="email"
              :required="true"
          />
          <ly-alert :message="loginStore.status.statusError"/>
        </div>

        <div v-if="stage === 'password'">
          <div class="flex items-center justify-center mb-5">
            <div
                class="flex items-center border border-divide rounded-full px-2 py-1 text-sm font-bold cursor-pointer"
                @click="stage = 'email'"
            >
              <ly-icon name="user" class="mr-1"/>
              <span>{{ loginModel.email }}</span>
            </div>
          </div>

          <ly-input-text
              v-if="stage === 'password'"
              name="current-password"
              property="password"
              type="password"
              :autofocus="true"
              :required="true"
          />

          <ly-alert :message="loginStore.status.statusError"/>
          <div class="flex items-center justify-between">
            <ly-input-checkbox
                property="remember"
                class="text-sm"
                label="users.login.remember_me"
            />
            <a v-if="stage === 'password'" class="no-underline font-bold text-xs">
              {{ $t("users.login.forgot_password") }}
            </a>
          </div>
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

      <div v-if="stage === 'password'">
        <ly-button
            v-if="stage === 'password'"
            class="primary w-full"
            form="login"
            :loading="loginStore.status.isStatusLoading()"
            @click="submit"
        >
          {{ $t("users.login.sign_in") }}
        </ly-button>
      </div>
    </template>
  </centered-layout-container>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
