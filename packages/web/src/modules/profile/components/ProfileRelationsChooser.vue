<script lang="ts" setup>
import { useProfileRelationInfosStore } from "@/modules/profile/stores/profile-relation-infos.store";
import { useProfileStore } from "@/modules/profile/stores/profile.store";
import ProfileAvatar from "@/modules/profile/components/ProfileAvatar.vue";
import DividedList from "@/modules/ui/components/list/DividedList.vue";
import ListItem from "@/modules/ui/components/list/ListItem.vue";
import TextDimmed from "@/modules/ui/components/text/TextDimmed.vue";
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AddButton from "@/modules/ui/components/button/AddButton.vue";
import { useCreateProfileStore } from "@/modules/profile/stores/create-profile.store";
import { profileRoute } from "@/modules/profile/routes/profile-route.util";
import Alert from "@/modules/ui/components/alert/Alert.vue";
import { ProfileRelationInfo } from "@lyvely/common";

const profileRelationInfosStore = useProfileRelationInfosStore();
const profileStore = useProfileStore();

const { statusError } = storeToRefs(profileRelationInfosStore);
const profileRelations = ref(await profileRelationInfosStore.getRelations());

const { profile } = storeToRefs(profileStore);
const { show: showCreateProfile } = storeToRefs(useCreateProfileStore());

const router = useRouter();

async function setProfile(pid: string) {
  router.push(profileRoute('/', pid));
}

function getProfileIcon(relation: ProfileRelationInfo) {
  return relation.isMultiUserProfile() ? 'group' : 'private';
}

// TODO: A user might have multiple relations with a single profile...
// TODO: (permissions) "Can create organizations" policy
// TODO: (permissions) "Can create profile" policy
</script>
<template>
  <ul v-if="statusError" class="divide-y divide-divide w-96">
    <li class="py-3 px-4">
      <alert :message="statusError" />
    </li>
  </ul>
  <ul v-else class="divide-y divide-divide w-96">
    <li class="py-3 px-4">
      <div class="flex items-center">
        <span class="text-sm font-bold">{{ $t('profile.labels.profiles') }}</span>
        <add-button class="m-auto" @click="showCreateProfile = true" />
      </div>
    </li>
    <li>
      <divided-list>
        <list-item v-for="relation in profileRelations.profiles" :active="profile.id === relation.id" :key="relation.pid" @click="setProfile(relation.id)">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <profile-avatar :profile="relation" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">
                {{ relation.name }}
              </p>
              <text-dimmed :text="relation.description" />
            </div>
            <div>
              <icon :name="getProfileIcon(relation)" />
            </div>
          </div>
        </list-item>
      </divided-list>
    </li>
    <li class="py-3 px-4">
      <div class="flex items-center">
        <span class="text-sm font-bold">{{ $t('profile.labels.organizations') }}</span>
        <add-button class="m-auto" />
      </div>
    </li>
    <li class="py-3 px-4 text-dimmed text-sm">
      <text-dimmed :text="$t('profile.messages.no-organization-relation')" />
    </li>
  </ul>
</template>

<style scoped>

</style>
