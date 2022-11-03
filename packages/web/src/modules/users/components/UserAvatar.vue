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
    'rounded-full uppercase flex justify-center items-center select-none border border-shadow dark:border-divide': true,
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
    'rounded-full uppercase flex justify-center items-center select-none border border-shadow dark:border-divide': true,
    'w-6': !includesUtilityClass(attrClasses, 'w'),
    'h-6': !includesUtilityClass(attrClasses, 'h'),
    'text-xs': !includesUtilityClass(attrClasses, 'text'),
    [attrClasses]: true,
  };
}
</script>

<template>
  <transition
      v-if="url"
      name="fade"
      mode="out-in"
      enter-active-class="animate__animated animate__faster animate__bounceIn"
      leave-active-class="animate__animated animate__faster animate__bounceOut">
    <img :key="url" :src="url" :class="getImageClassNames($attrs.class)" />
  </transition>
  <transition
      v-else
      name="fade"
      mode="out-in"
      enter-active-class="animate__animated animate__faster animate__bounceIn"
      leave-active-class="animate__animated animate__faster animate__bounceOut">
  <div :class="getClassNames($attrs.class, textClass)" :style="{ 'background-color': color }">
    {{ initials }}
  </div>
  </transition>

</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
