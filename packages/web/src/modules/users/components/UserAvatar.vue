<script lang="ts" setup>
import { computed } from "vue";
import { createFileUrl } from "@/repository";
import randomColor from "randomcolor";
import { UserModel } from "@lyvely/common";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { getContrast } from "@/modules/ui/utils";

interface IProps {
  user?: Pick<UserModel, "id" | "imageHash" | "username">;
}

const props = defineProps<IProps>();

const avatarUser = computed(() => props.user || useAuthStore().user);
const url = computed(() =>
  avatarUser.value?.imageHash
    ? createFileUrl(avatarUser.value.imageHash)
    : undefined
);
const initials = computed(() => avatarUser.value?.username.substring(0, 2));
const color = computed(() =>
  randomColor({ seed: avatarUser.value?.username + "_user" || "" })
);
const textClass = computed(() => {
  return getContrast(color.value) === "black"
    ? "text-slate-900"
    : "text-slate-100";
});
</script>

<template>
  <img v-if="url" src="url" />
  <div
    :class="[
      'rounded-full w-6 h-6 uppercase flex justify-center items-center text-xs p-1',
      textClass,
    ]"
    :style="{ 'background-color': color }"
  >
    {{ initials }}
  </div>
</template>

<style scoped></style>
