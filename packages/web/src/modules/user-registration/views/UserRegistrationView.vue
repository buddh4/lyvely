<script lang="ts" setup>
import CenteredLayoutContainer from "@/modules/ui/components/layout/CenteredLayoutContainer.vue";
import { useUserRegistrationStore } from "@/modules/user-registration/stores/user-registration.store";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { watch } from "vue";

const userRegistrationStore = useUserRegistrationStore();
const router = useRouter();

const { model, validator, status } = storeToRefs(userRegistrationStore);
const { isStatusLoading } = userRegistrationStore;

watch(status, () => {
  if (userRegistrationStore.isStatusSuccess()) {
    router.push("/");
  }
});

async function register() {
  userRegistrationStore.register();
}

function validateEmail() {
  validator.value.validateField('email').then((value) => {
    if(value) {
      console.log('validate email');
    }
  })
}
</script>

<template>
  <centered-layout-container>
    <template #title>
      <ly-icon name="lyvely" class="fill-current text-lyvely mr-2 w-6" />
      {{ $t("users.labels.sign_up") }}
    </template>

    <ly-form-model
      v-model="model"
      :validator="validator"
      :status="status"
      label-key="user_registration.form.fields"
    >
      <ly-input-text property="username" :required="true" />
      <ly-input-text property="email" type="email" :required="true" @change="validateEmail" />
      <ly-input-text property="password" type="password" :required="true" />
    </ly-form-model>

    <ly-button
      class="primary mb-4 float-right"
      text="users.labels.sign_up"
      :disabled="isStatusLoading()"
      @click="register"
    />
  </centered-layout-container>
</template>

<style scoped></style>
