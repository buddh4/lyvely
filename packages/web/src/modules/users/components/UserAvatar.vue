<script lang="ts" setup>
import { computed } from 'vue';
import { createAvatarUrl } from '@/repository';
import randomColor from 'randomcolor';
import { UserModel } from '@lyvely/common';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { getContrast, includesUtilityClass } from '@/modules/ui/utils';

export interface IProps {
  user?: Pick<UserModel, 'id' | 'avatar' | 'username'>;
  size?: string;
}

const props = defineProps<IProps>();

const avatarUser = computed(() => props.user || useAuthStore().user);
const url = computed(() => (avatarUser.value?.avatar?.guid ? createAvatarUrl(avatarUser.value.avatar) : undefined));
const initials = computed(() => avatarUser.value?.username.substring(0, 2));
const color = computed(() => randomColor({ seed: avatarUser.value?.username + '_user' || '' }));
const textClass = computed(() => {
  return getContrast(color.value) === 'black' ? 'text-slate-900' : 'text-slate-100';
});

function getClassNames(attrClasses: any, textClass: string) {
  return {
    'rounded-full uppercase flex justify-center items-center select-none': true,
    'p-1': !includesUtilityClass(attrClasses, 'p'),
    'w-6': !includesUtilityClass(attrClasses, 'w'),
    'h-6': !includesUtilityClass(attrClasses, 'h'),
    'text-xs': !includesUtilityClass(attrClasses, 'text'),
    [attrClasses]: true,
    [textClass]: true,
  };
}

function getImageClassNames(attrClasses: any) {
  return {
    'rounded-full uppercase flex justify-center items-center select-none': true,
    'w-6': !includesUtilityClass(attrClasses, 'w'),
    'h-6': !includesUtilityClass(attrClasses, 'h'),
    'text-xs': !includesUtilityClass(attrClasses, 'text'),
    [attrClasses]: true,
  };
}
</script>

<template>
  <img v-if="url" :src="url" :class="getImageClassNames($attrs.class)" />
  <div v-else :class="getClassNames($attrs.class, textClass)" :style="{ 'background-color': color }">
    {{ initials }}
  </div>
</template>

<style scoped></style>
