<script lang="ts" setup>
import TextInput from '@/modules/ui/components/form/TextInput.vue';
import Alert from '@/modules/ui/components/alert/Alert.vue';
import CenteredLayoutContainer from '@/modules/ui/components/layout/CenteredLayoutContainer.vue';
import Button from '@/modules/ui/components/button/Button.vue';
import { computed } from 'vue';
import { useRegisterStore } from '@/modules/user/store/register.store';
import { useRouter } from 'vue-router';

const store = useRegisterStore();
const router = useRouter();

const errorMsg = computed(() => store.errorMsg);
const isError = computed(() => store.isStatusError());
const model = computed(() => store.model);

function getError(field: string) {
  return store.getError(field);
}

async function register() {
  store.register().then(() => {
    if (store.isStatusSuccess()) {
      router.push('/');
    }
  });
}
</script>

<template>
   <CenteredLayoutContainer title="users.labels.sign_up">
     <form class="min-w-max" @submit.prevent="register">
       <TextInput
         id="registerUsername"
         v-model="model.username"
         :error="getError('username')"
         label="users.labels.username"></TextInput>
       <TextInput
         id="registerEmail"
         v-model="model.email"
         :error="getError('email')"
         label="users.labels.email"></TextInput>
       <TextInput
         id="registerPassword"
         v-model="model.password"
         type="password"
         :error="getError('password')"
         label="users.labels.password"></TextInput>

       <Alert v-if="isError" data-register-error class="danger my-2">
         {{ $t(errorMsg) }}
       </Alert>

       <Button :submit="true" class="primary mb-4 float-right" text="users.labels.sign_up"></Button>
     </form>
   </CenteredLayoutContainer>
</template>

<style scoped></style>
