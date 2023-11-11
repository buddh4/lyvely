<script lang="ts" setup>
import { computed, ref } from 'vue';
import { getContrast, includesUtilityClass } from '@/helpers';
import randomColor from 'randomcolor';
import { AvatarData } from '@/interfaces';
import { createAvatarUrl } from '@/config';

export interface IProps {
  avatar?: AvatarData;
  name: string;
  guid?: string;
  url?: string;
  timestamp?: number;
}

const props = defineProps<IProps>();

const guid = computed(() => props.avatar?.guid || props.guid);
const timestamp = computed(() => props.avatar?.timestamp || props.timestamp);

const imgError = ref(false);

const url = computed(() => {
  return imgError.value
    ? undefined
    : props.url
    ? props.url
    : guid.value
    ? createAvatarUrl(guid.value!, timestamp.value)
    : undefined;
});

const initials = computed(() => (url.value ? undefined : props.name?.substring(0, 2)));
const color = computed(() =>
  url.value ? undefined : randomColor({ seed: props.name + '_user' + guid.value || '' }),
);
const textClass = computed(() =>
  !url.value && color.value
    ? getContrast(color.value!) === 'dark'
      ? 'text-slate-900'
      : 'text-slate-100'
    : '',
);

function getClassNames(attrClasses: any, textClass: string) {
  return {
    'rounded-full uppercase flex justify-center items-center select-none border border-shadow dark:border-divide':
      true,
    'p-1': !includesUtilityClass(attrClasses, 'p'),
    'w-6': !includesUtilityClass(attrClasses, 'w'),
    'h-6': !includesUtilityClass(attrClasses, 'h'),
    'text-xxs': !includesUtilityClass(attrClasses, 'text'),
    [attrClasses]: true,
    [textClass]: true,
  };
}

function getImageClassNames(attrClasses: any) {
  return {
    'rounded-full uppercase flex justify-center items-center select-none border border-shadow dark:border-divide':
      true,
    'w-6': !includesUtilityClass(attrClasses, 'w'),
    'h-6': !includesUtilityClass(attrClasses, 'h'),
    'text-xxs': !includesUtilityClass(attrClasses, 'text'),
    [attrClasses]: true,
  };
}
</script>

<template>
  <img
    v-if="url"
    :key="url"
    :alt="name"
    :src="url"
    :class="getImageClassNames($attrs.class)"
    @error="imgError = true" />
  <div
    v-else
    :class="getClassNames($attrs.class, textClass)"
    :style="{ 'background-color': color }">
    {{ initials }}
  </div>
</template>

<style scoped></style>
