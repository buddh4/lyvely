<script lang="ts" setup>
import { useProfileRelationsStore } from "@/modules/profile/stores/profile-relations.store";
import { useProfileStore } from "@/modules/profile/stores/profile.store";
import ProfileAvatar from "@/modules/profile/components/ProfileAvatar.vue";
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AddButton from "@/modules/ui/components/button/AddButton.vue";
import { useCreateProfileStore } from "@/modules/profile/stores/create-profile.store";
import { profileRoute } from "@/modules/profile/routes/profile-route.util";

const profileRelations = ref(await useProfileRelationsStore().getRelations());
const profile = ref(useProfileStore().profile);
const { show: showCreateProfile } = storeToRefs(useCreateProfileStore());

const router = useRouter();

async function setProfile(pid: string) {
  router.push(profileRoute('/', pid));
}

// TODO: A user might have multiple relations with a single profile...
// TODO: (permissions) "Can create organizations" policy
// TODO: (permissions) "Can create profile" policy
</script>

<template>
  <ul class="divide-y divide-divide w-96">
    <li class="py-3 px-4">
      <div class="flex items-center">
        <span class="text-sm font-bold">Profiles</span>
        <AddButton class="m-auto" @click="showCreateProfile = true" />
      </div>
    </li>
    <li>
    <ul class="scrollbar-thin divide-y divide-divide max-h-60 overflow-auto">
      <li v-for="profileRelation in profileRelations" :key="profileRelation.pid" :class="['hover:bg-highlight dark:hover:bg-main  cursor-pointer']" @click="setProfile(profileRelation.id)">
        <div role="button" :class="['p-4 border-l-4', profile.id === profileRelation.id ? 'border-pop' : 'border-transparent']">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <ProfileAvatar :profile="profileRelation" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">
                {{ profileRelation.name }}
              </p>
              <p class="text-sm truncate text-dimmed">
                {{ profileRelation.description }}
              </p>
            </div>
          </div>
        </div>
      </li>
    </ul>
    </li>
    <li class="py-3 px-4">
      <div class="flex items-center">
        <span class="text-sm font-bold">Organizations</span>
        <AddButton class="m-auto" />
      </div>
    </li>
    <li class="py-3 px-4 text-dimmed text-sm">
      You are not a member of any organization.
    </li>
  </ul>
</template>

<style scoped>

</style>
