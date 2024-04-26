<script lang="ts" setup>
import { ref } from 'vue';
import { uniqueId } from 'lodash';
import { onClickOutside } from '@vueuse/core';
import { t, Translatable } from '@/i18n';
import { findParent } from '@/helpers';

export interface IProps {
  label?: Translatable;
  icon?: string;
  position?: 'left' | 'right';
  buttonClass?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  icon: 'dropdown',
  label: '',
  position: 'left',
  buttonClass: '',
});

const open = ref(false);

const root = ref<HTMLElement>();

onClickOutside(root, () => (open.value = false));

const className = ['flex', 'dropdown'];
const buttonClassName = [
  'inline-flex justify-center  leading-5 z-10 block rounded-md',
  props.buttonClass,
];

const id = uniqueId('dropdown-');

function onClickContent(evt: MouseEvent) {
  if (evt.target instanceof HTMLElement && !findParent(evt.target, '.prev-close')) {
    open.value = false;
  }
}

function navigateDown() {
  const activeElement = document.activeElement;
  if (!activeElement || !activeElement.closest('.dropdown-items')) {
    const prev: HTMLElement | null | undefined = root.value
      ?.querySelector('.dropdown-items')
      ?.querySelector('a,button');
    prev?.focus();
  } else if (activeElement.nextElementSibling instanceof HTMLElement) {
    activeElement.nextElementSibling.focus();
  }
}

function navigateUp() {
  const activeElement = document.activeElement;
  if (!activeElement || !activeElement.closest('.dropdown-items')) {
    open.value = false;
  } else if (activeElement.previousElementSibling instanceof HTMLElement) {
    activeElement.previousElementSibling.focus();
  }
}

function toggle() {
  open.value = !open.value;
}
</script>

<template>
  <div
    ref="root"
    :class="className"
    @keydown.prevent.down="navigateDown"
    @keydown.prevent.up="navigateUp"
    @keydown.esc="open = false">
    <div class="relative">
      <slot name="trigger" :toggle="toggle" :state="open">
        <button
          :id="id"
          :class="buttonClassName"
          :aria-expanded="open ? 'true' : 'false'"
          @click="toggle">
          <span v-if="label" class="label text-sm">{{ t(label) }}</span>
          <ly-icon v-if="icon" :name="icon" />
        </button>
      </slot>

      <div
        v-if="open"
        :aria-labelledby="id"
        :class="[
          'absolute dropdown-items py-2 bg-main dark:bg-shadow rounded-md shadow-lg border border-divide z-20',
          position === 'left' ? 'right-0.5' : 'left-0.5',
        ]"
        @click="onClickContent">
        <slot :toggle="toggle" :state="open"></slot>
      </div>
    </div>
  </div>
</template>

<style>
.dropdown .label + svg {
  @apply ml-2;
}

.dropdown a:focus {
  background-color: var(--elements-highlight);
}
</style>
