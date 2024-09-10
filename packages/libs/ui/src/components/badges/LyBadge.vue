<script lang="ts" setup>
import { computed, CSSProperties } from 'vue';
import { getContrast } from '@/helpers';
import { t, Translatable } from '@/i18n';
import { twMerge } from 'tailwind-merge';
import LyIcon from '@/components/icons/LyIcon.vue';
import LyButton from '@/components/buttons/LyButton.vue';
import { type IAvatar } from '@/interfaces';
import { truncate } from '@lyvely/common';
import type { IconBindingsIF } from '@/components/icons';

export interface IProps {
  modelValue?: boolean;
  text?: Translatable;
  description?: Translatable;
  avatar?: IAvatar;
  icon?: string;
  iconBindings?: IconBindingsIF;
  color?: string;
  textColor?: string;
  clickable?: boolean;
  enterActiveClass?: string;
  leaveActiveClass?: string;
  closable?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: true,
  text: '',
  avatar: undefined,
  color: undefined,
  clickable: true,
  enterActiveClass: 'animate__animated animate__faster animate__fadeIn',
  leaveActiveClass: 'animate__animated animate__faster animate__fadeOut',
  closable: false,
  textColor: undefined,
});

const emit = defineEmits(['update:modelValue']);

function getClassNames(attrClasses: any, clickable: boolean) {
  return twMerge(
    `badge inline-block leading-3 overflow-hidden rounded select-none py-0.5 px-1.5 text-xs`,
    textClass.value,
    clickable && 'cursor-pointer',
    attrClasses
  );
}

const textClass = computed(() => {
  const textContrast = props.color ? getContrast(props.color) : 'light';
  return textContrast === 'dark' ? 'text-slate-900' : 'text-slate-100';
});

const dimmedTextClass = computed(() => {
  const textContrast = props.color ? getContrast(props.color) : 'light';
  return textContrast === 'dark' ? 'text-slate-700' : 'text-slate-300';
});

const styleObject = computed<CSSProperties>(() => {
  let result: CSSProperties = {};
  if (props.color) result['background-color'] = props.color;
  if (props.textColor) result['color'] = props.textColor;
  return result;
});

const isPlainTag = computed(() => {
  return !props.avatar && !props.icon && !props.description;
});

const show = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});
</script>

<template>
  <transition :enter-active-class="enterActiveClass" :leave-active-class="leaveActiveClass">
    <span v-if="modelValue" :class="getClassNames($attrs.class, clickable)" :style="styleObject">
      <small class="text-xs">
        <slot>
          <div class="inline-flex items-center gap-1">
            <ly-avatar v-if="avatar" :avatar="avatar" class="m-1" />
            <ly-icon v-else-if="icon" :name="icon" v-bind="iconBindings" />
            <div :class="['flex flex-col', { 'font-bold': !isPlainTag }]">
              <span>{{ truncate(t(text), 30) }}</span>
            </div>
            <ly-button v-if="closable" class="px-0 py-1" @click="show = false">
              <ly-icon name="close" class="w-2.5" :class="textClass" />
            </ly-button>
          </div>
          <div v-if="description" :class="[dimmedTextClass, 'p-1 text-xs']">
            <span>{{ truncate(t(description), 30) }}</span>
          </div>
        </slot>
      </small>
    </span>
  </transition>
</template>

<style lang="postcss">
.badge-dark {
  color: rgb(var(--color-inverted) / 1);
}
.badge-light {
  color: #000000;
}
</style>
