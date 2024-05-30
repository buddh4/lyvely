<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { getContrast, includesUtilityClass } from '@/helpers';
import randomColor from 'randomcolor';
import { AvatarData } from '@/interfaces';
import { createAvatarUrl } from '@/config';

export interface IProps {
  avatar?: AvatarData;
  name: string;
  guid?: string;
  url?: string;
  border?: boolean;
  timestamp?: number;
}

const props = withDefaults(defineProps<IProps>(), {
  border: true,
});

const imgGuid = computed(() => props.avatar?.guid || props.guid);
const imgTimestamp = computed(() => props.avatar?.timestamp || props.timestamp);
const imgError = ref(false);

watch(
  () => props.avatar,
  () => {
    imgError.value = false;
  }
);

watch(
  () => props.guid,
  () => {
    imgError.value = false;
  }
);

const imgUrl = computed(() => {
  return imgError.value
    ? undefined
    : props.url
      ? props.url
      : imgGuid.value
        ? createAvatarUrl(imgGuid.value!, imgTimestamp.value)
        : undefined;
});

const initials = computed(() => (imgUrl.value ? undefined : props.name?.substring(0, 2)));
const color = computed(() =>
  imgUrl.value ? undefined : randomColor({ seed: props.name + '_user' + imgGuid.value || '' })
);
const textClass = computed(() =>
  !imgUrl.value && color.value
    ? getContrast(color.value!) === 'dark'
      ? 'text-slate-900'
      : 'text-slate-100'
    : ''
);

function getClassNames(attrClasses: any, textClass: string) {
  return {
    'rounded-full uppercase flex justify-center items-center select-none': true,
    'border border-shadow dark:border-divide': props.border,
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
    'rounded-full uppercase flex justify-center items-center select-none': true,
    'border border-shadow dark:border-divide': props.border,
    'w-6': !includesUtilityClass(attrClasses, 'w'),
    'h-6': !includesUtilityClass(attrClasses, 'h'),
    'text-xxs': !includesUtilityClass(attrClasses, 'text'),
    [attrClasses]: true,
  };
}
</script>

<template>
  <img
    v-if="imgUrl"
    v-bind="$attrs"
    :alt="name"
    :src="imgUrl"
    :class="getImageClassNames($attrs.class)"
    @error="imgError = true" />
  <div
    v-else
    v-bind="$attrs"
    :class="getClassNames($attrs.class, textClass)"
    :style="{ 'background-color': color }">
    {{ initials }}
  </div>
</template>

<style scoped></style>
