<script lang="ts" setup>
import { useProfileRelationsStore } from "@/modules/profile/stores/profile-relations.store";
import { useProfileStore } from "@/modules/profile/stores/profile.store";
import ProfileAvatar from "@/modules/profile/components/ProfileAvatar.vue";
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AddButton from "@/modules/ui/components/button/AddButton.vue";

const profileRelations = ref(await useProfileRelationsStore().getRelations());
const profile = ref(useProfileStore().profile);

const router = useRouter();

async function setProfile(pid: string) {
  await useProfileStore().loadProfile(pid);
  router.push('/');

}


// TODO: A user might have multile relations with a single profile...
// TODO: Can create organization, profile policy
</script>

<template>
  <ul class="divide-y divide-divide w-96">
    <li class="py-3 px-4">
      <div class="flex items-center">
        <span class="text-sm font-bold">Profiles</span>
        <AddButton class="m-auto" />
      </div>
    </li>
    <li v-for="profileRelation in profileRelations" :key="profileRelation.pid" :class="['hover:bg-highlight dark:hover:bg-main  cursor-pointer']" @click="setProfile(profileRelation.pid)">
      <div :class="['p-4 border-l-4', profile.id === profileRelation.id ? 'border-pop' : 'border-transparent']">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <ProfileAvatar :profile="profileRelation" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">
              {{ profileRelation.name }}
            </p>
            <p class="text-sm truncate text-dimmed">
              Some other text...
            </p>
          </div>
        </div>
      </div>
    </li>
    <li class="py-3 px-4">
      <div class="flex items-center">
        <span class="text-sm font-bold">Organizations</span>
        <AddButton class="m-auto" />
      </div>
    </li>
  </ul>
</template>

<style scoped>

</style>
