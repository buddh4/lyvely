<script lang="ts" setup>
import { Size } from "@/modules/ui/types";
import ProfileSidebar from "@/modules/profile/components/layout/ProfileSidebar.vue";
import MainProfileContainer from "@/modules/profile/components/layout/MainProfileContainer.vue";
import { computed } from 'vue';
import { useAuthStore } from "@/modules/user/store/auth.store";
import CreateProfileModal from "@/modules/profile/components/modals/CreateProfileModal.vue";
import InviteUsersModal from "@/modules/profile/components/modals/InviteUsersModal.vue";

interface Props {
  containerWidth?: 'xs'|'sm'|'lg'|'xl'|'full',
  requireAuth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  containerWidth: Size.LG,
  requireAuth: true
});

const containerProps = computed(() => ({
  width: props.containerWidth
}));

const show = computed(() => props.requireAuth ? useAuthStore().isAuthenticated : true);

</script>

<template>
  <ProfileSidebar v-if="show" />
  <div v-if="show" class="overflow-hidden flex w-full min-h-screen flex-col">
    <div class="flex items-stretch flex-col h-screen">
      <MainProfileContainer v-bind="containerProps">
        <slot>
          <router-view></router-view>
        </slot>
      </MainProfileContainer>
    </div>
  </div>
  <CreateProfileModal />
  <InviteUsersModal />
</template>

<style scoped>

</style>
