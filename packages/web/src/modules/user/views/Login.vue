<script lang="ts" setup>
import { Status } from "@/store/status";
import CenteredLayoutContainer from '@/modules/ui/components/layout/CenteredLayoutContainer.vue';
import TextInput from '@/modules/ui/components/form/TextInput.vue';
import Checkbox from '@/modules/ui/components/form/Checkbox.vue';
import Button from '@/modules/ui/components/button/Button.vue';
import Alert from '@/modules/ui/components/alert/Alert.vue';
import { useAuthStore } from "../store/auth.store";
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const input = reactive({username: '', password: ''});

const isLoginErrorState = computed(() => authStore.status === Status.ERROR);
const errorMsg = computed(() => authStore.errorMsg);

async function login() {
  authStore.errorMsg = '';
  if (!validate()) {
    return;
  }

  if(await authStore.login(input.username, input.password)) {
    await router.replace({ path: "/" });
  }
}

const userNameError = ref('');
const passwordError = ref('');

function validate(): boolean {
  passwordError.value = '';
  userNameError.value = '';

  if (input.username && input.password) {
    return true;
  }

  if(!input.password) {
    passwordError.value = "Password is required.";
  }

  if(!input.username) {
    userNameError.value = "Username is required.";
  }

  return false;
}

</script>

<template>
  <CenteredLayoutContainer title="users.labels.sign_in">

    <form class="min-w-max" novalidate @submit.prevent="login">
      <!-- Email input -->
      <div class="mb-4">
        <TextInput id="login-username" v-model="input.username" :error="userNameError" label="users.labels.username" :required="true"></TextInput>
      </div>

      <!-- Password input -->
      <div class="mb-4">
        <TextInput id="login-password" v-model="input.password" :error="passwordError" label="users.labels.password" :required="true" type="password"></TextInput>
      </div>

      <!-- 2 column grid layout for inline styling -->
      <div class="flex justify-center items-center justify-between clearfix pb-2">

          <Checkbox label="users.labels.remember_me"></Checkbox>
          <small class="float-right align-center"><a href="#" class="no-underline">{{ $t('users.labels.forgot_password') }}</a></small>

      </div>

      <Alert v-if="isLoginErrorState" :message="errorMsg" data-login-error class="danger my-2" />

      <Button class="primary w-full" :submit="true">{{ $t('users.labels.sign_in') }}</Button>
    </form>

    <!-- Register buttons -->
    <div class="text-center pt-4">
      <small>
        {{ $t('users.texts.not_a_member') }}
        <router-link to="/register" class="no-underline">{{ $t('users.labels.sign_up') }}</router-link>
      </small>
    </div>

  </CenteredLayoutContainer>
</template>

<style scoped></style>
