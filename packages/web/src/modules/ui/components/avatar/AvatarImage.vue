<script lang="ts" setup>
import { AvatarModel } from '@lyvely/common/src';
import { computed } from 'vue';
import { createAvatarUrl } from '@/repository';
import randomColor from 'randomcolor';
import { getContrast, includesUtilityClass } from '@/modules/ui/utils';

export interface IProps {
  avatar?: AvatarModel;
  name: string;
  guid?: string;
  url?: string;
  timestamp?: number;
  size?: string;
}

const props = defineProps<IProps>();

const guid = computed(() => props.avatar?.guid || props.guid);
const timestamp = computed(() => props.avatar?.timestamp || props.timestamp);
const url = computed(() => {
  return props.url ? props.url : guid.value ? createAvatarUrl(guid.value, timestamp.value) : undefined;
});

const initials = computed(() => (url.value ? undefined : props.name?.substring(0, 2)));
const color = computed(() => (url.value ? undefined : randomColor({ seed: props.name + '_user' || '' })));
const textClass = computed(() =>
  !url.value && color.value ? (getContrast(color.value) === 'black' ? 'text-slate-900' : 'text-slate-100') : undefined,
);

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
    leave-active-class="animate__animated animate__faster animate__bounceOut"
  >
    <img :key="url" :src="url" :class="getImageClassNames($attrs.class)" />
  </transition>
  <transition
    v-else
    name="fade"
    mode="out-in"
    enter-active-class="animate__animated animate__faster animate__bounceIn"
    leave-active-class="animate__animated animate__faster animate__bounceOut"
  >
    <div :class="getClassNames($attrs.class, textClass)" :style="{ 'background-color': color }">
      {{ initials }}
    </div>
  </transition>
</template>

<style scoped></style>
