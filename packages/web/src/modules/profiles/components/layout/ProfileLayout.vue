<script lang="ts" setup>
import { Size } from "@/modules/ui/types";
import ProfileSidebar from "./snippets/ProfileSidebar.vue";
import MainProfileContainer from "./MainProfileContainer.vue";
import { computed } from "vue";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import CreateProfileModal from "../modals/CreateProfileModal.vue";
import InviteUsersModal from "../modals/InviteUsersModal.vue";

interface IProps {
  containerWidth?: "xs" | "sm" | "lg" | "xl" | "full";
  requireAuth?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  containerWidth: Size.LG,
  requireAuth: true,
});

const containerProps = computed(() => ({
  width: props.containerWidth,
}));

const show = computed(() =>
  props.requireAuth ? useAuthStore().isAuthenticated : true
);
</script>

<template>
  <profile-sidebar v-if="show" />
  <div v-if="show" class="overflow-hidden flex w-full min-h-screen flex-col">
    <div class="flex items-stretch flex-col h-screen">
      <main-profile-container v-bind="containerProps">
        <slot>
          <router-view></router-view>
        </slot>
      </main-profile-container>
    </div>
  </div>
  <create-profile-modal />
  <invite-users-modal />
</template>

<style scoped></style>
