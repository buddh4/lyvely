<script lang="ts" setup>
import CenteredLayoutContainer from "@/modules/ui/components/layout/CenteredLayoutContainer.vue";
import { computed } from "vue";
import { useRegisterStore } from "@/modules/users/store/register.store";
import { useRouter } from "vue-router";

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
      router.push("/");
    }
  });
}
</script>

<template>
  <centered-layout-container title="users.labels.sign_up">
    <form class="min-w-max" @submit.prevent="register">
      <ly-input-text
        id="registerUsername"
        v-model="model.username"
        :error="getError('username')"
        label="users.labels.username"
      ></ly-input-text>
      <ly-input-text
        id="registerEmail"
        v-model="model.email"
        :error="getError('email')"
        label="users.labels.email"
      ></ly-input-text>
      <ly-input-text
        id="registerPassword"
        v-model="model.password"
        type="password"
        :error="getError('password')"
        label="users.labels.password"
      ></ly-input-text>

      <ly-alert
        v-if="isError"
        :message="errorMsg"
        data-register-error
        class="danger my-2"
      />

      <ly-button
        :submit="true"
        class="primary mb-4 float-right"
        text="users.labels.sign_up"
      ></ly-button>
    </form>
  </centered-layout-container>
</template>

<style scoped></style>
