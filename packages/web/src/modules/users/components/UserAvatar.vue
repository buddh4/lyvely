<script lang="ts" setup>
import { computed } from "vue";
import { createFileUrl } from "@/repository";
import randomColor from "randomcolor";
import { UserModel } from "@lyvely/common";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { getContrast, includesUtilityClass } from "@/modules/ui/utils";

interface IProps {
  user?: Pick<UserModel, "id" | "imageHash" | "username">;
  size?: string;
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

function getClassNames(attrClasses: any, textClass: string) {
  return {
    "rounded-full uppercase flex justify-center items-center ": true,
    "p-1": !includesUtilityClass(attrClasses, "p"),
    "w-6": !includesUtilityClass(attrClasses, "w"),
    "h-6": !includesUtilityClass(attrClasses, "h"),
    "text-xs": !includesUtilityClass(attrClasses, "text"),
    [attrClasses]: true,
    [textClass]: true,
  };
}
</script>

<template>
  <img v-if="url" :src="url" />
  <div
    :class="getClassNames($attrs.class, textClass)"
    :style="{ 'background-color': color }"
  >
    {{ initials }}
  </div>
</template>

<style scoped></style>
