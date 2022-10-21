<script lang="ts" setup>
import { useAuthStore } from "@/modules/auth/store/auth.store";
import AddButton from "@/modules/ui/components/button/AddButton.vue";
import ListPage from "@/modules/ui/components/layout/ListPage.vue";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useAddEmailStore } from "@/modules/account/stores/add-email.store";
import AddEmailModal from "@/modules/account/components/modals/AddEmailModal.vue";
import VerifyEmailModal from "@/modules/account/components/modals/VerifyEmailModal.vue";

const { user } = storeToRefs(useAuthStore());
const addEmailStore = useAddEmailStore();

const { showModal: showAddEmailModal } = storeToRefs(addEmailStore);

const userEmails = computed(() => {
  const authStore = useAuthStore();
  return authStore.user?.emails.sort((a, b) => {
    if (authStore.user?.email === a.email) return -1;
    if (authStore.user?.email === b.email) return 1;
    if (a.verified !== b.verified) return a.verified ? -1 : 1;
    return a.email < b.email ? -1 : 1;
  });
});
</script>

<template>
  <list-page title="account.my_account.info.label" class="mb-2" icon="info">
    <table class="border-separate text-sm w-full bg-main">
      <tr>
        <th class="p-3 text-left border-b border-divide">
          {{ $t("account.my_account.info.username") }}
        </th>
        <td class="p-3 text-left border-b border-divide">
          {{ user.username }}
        </td>
      </tr>
      <tr>
        <th class="p-3 text-left border-b border-divide">
          {{ $t("account.my_account.info.member_since") }}
        </th>
        <td class="p-3 text-left border-b border-divide">
          <ly-formatted-date :date="user.createdAt" />
        </td>
      </tr>
      <tr>
        <th class="p-3 text-left">
          {{ $t("account.my_account.info.locale") }}
        </th>
        <td class="bg-main p-3 text-left">
          {{ user.locale }}
        </td>
      </tr>
    </table>
  </list-page>

  <list-page title="account.my_account.info.emails" icon="email">
    <template #header-right>
      <add-button @click="showAddEmailModal = true" />
    </template>
    <div
      v-for="userEmail in userEmails"
      :key="userEmail.email"
      class="flex py-4 px-3 bg-main items-center border-divide"
    >
      <ly-icon
        v-if="userEmail.email === user.email"
        name="star"
        class="mr-1 text-pop"
        title="account.my_account.info.main_email"
        tabindex="0"
      />
      <ly-icon
        v-else-if="!userEmail.verified"
        name="warning"
        class="mr-1 text-warning"
        title="account.my_account.info.unverified_email"
        tabindex="0"
      />
      <ly-icon
        v-else
        name="success"
        class="mr-1 text-success-light"
        title="account.my_account.info.verified_email"
        tabindex="0"
      />
      {{ userEmail.email }}
    </div>
  </list-page>

  <add-email-modal />
  <verify-email-modal />
</template>

<style scoped></style>
