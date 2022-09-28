<script lang="ts" setup>
import { useProfileStore } from "@/modules/profiles/stores/profile.store";
import { ref } from "vue";
import LyInputText from "@/modules/ui/components/form/TextInput.vue";
import LyProfileAvatar from "@/modules/profiles/components/ProfileAvatar.vue";
import LyInputTextarea from "@/modules/ui/components/form/TextareaInput.vue";
import LyButton from "@/modules/ui/components/button/StyledButton.vue";

const profileStore = useProfileStore();
const name = ref(profileStore.profile?.name);
const description = ref(profileStore.profile?.description);

//function rename() {}
</script>

<template>
  <div
    class="bg-main flex flex-col p-4 rounded shadow-sm mb-2 border border-divide"
  >
    <div class="flex items-center mb-2 flex-row items-stretch">
      <div class="w-full">
        <ly-input-text v-model="name" label="profile.settings.general.name" />
      </div>
      <div
        class="ml-3 bg-highlight w-20 flex justify-center items-center rounded border border-divide cursor-pointer"
      >
        <ly-profile-avatar class="m-3" />
      </div>
    </div>
    <ly-input-textarea
      v-model="description"
      label="profile.settings.description"
    />
    <div>
      <ly-button class="primary float-right">
        {{ $t("common.update") }}
      </ly-button>
    </div>
  </div>

  <div
    class="bg-main p-4 rounded shadow-sm mb-4 flex flex-col border border-divide"
  >
    <div>
      <ly-button
        class="danger float-right"
        :confirm="{ text: 'profile.settings.archive.confirm' }"
      >
        {{ $t("common.archive") }}
      </ly-button>
    </div>
  </div>
</template>

<style scoped></style>
