<script lang="ts" setup>
import { ref } from "vue";
import LyInputText from "@/modules/ui/components/form/TextInput.vue";
import LyUserAvatar from "@/modules/users/components/UserAvatar.vue";
import LyInputTextarea from "@/modules/ui/components/form/TextareaInput.vue";
import LyButton from "@/modules/ui/components/button/StyledButton.vue";

const displayName = ref("");
const description = ref("");
</script>

<template>
  <div
    class="bg-main flex flex-col p-4 rounded shadow-sm mb-2 border border-divide"
  >
    <div class="flex items-center mb-2 flex-row items-stretch">
      <div class="w-full relative">
        <ly-button class="absolute right-0.5 bottom-0.5 text-xs z-10">
          {{ $t("common.restore") }}
        </ly-button>
        <ly-input-text
          v-model="displayName"
          class="mb-0"
          label="profile.settings.user.displayName"
        />
      </div>
      <div
        class="ml-3 bg-highlight w-20 flex justify-center items-center rounded border border-divide cursor-pointer"
      >
        <ly-user-avatar class="m-3" />
      </div>
    </div>

    <div class="w-full relative">
      <ly-input-textarea
        v-model="description"
        label="profile.settings.user.description"
      />
      <ly-button class="absolute right-2 bottom-2 text-xs">
        {{ $t("common.restore") }}
      </ly-button>
    </div>

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
        {{ $t("profile.settings.user.archive") }}
      </ly-button>
    </div>
  </div>
</template>

<style scoped></style>
