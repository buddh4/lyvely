<script lang="ts" setup>
import Icon from '@/modules/ui/components/icon/Icon.vue';
import { ref, toRefs } from 'vue';
import { uniqueId } from 'lodash';
import { onClickOutside } from '@vueuse/core'

interface Props {
  label?: string,
  icon?: string,
  buttonClass?:string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'dropdown',
  label: '',
  buttonClass: ''
});

const open = ref(false);

const root = ref<HTMLElement|null>(null);

onClickOutside(root, (event) => open.value = false);

const className = ['flex','dropdown'];
const buttonClassName = ['inline-flex justify-center  leading-5 z-10 block rounded-md p-3', props.buttonClass];

const id = uniqueId('dropdown-');
const { icon, label } = toRefs(props);

function onClickContent(evt: { target: HTMLElement }) {
  if(!evt.target.classList.contains('prev-close')) {
    open.value = false;
  }
}

function navigateDown(evt: KeyboardEvent) {
  const activeElement = document.activeElement;
  if(!activeElement || !activeElement.closest('.dropdown-items')) {
    root.value?.querySelector('.dropdown-items')?.querySelector<HTMLElement>('a,button')?.focus();
  } else if(activeElement.nextElementSibling) {
    (<HTMLElement> activeElement.nextElementSibling).focus()
  }
}

function navigateUp(evt: KeyboardEvent) {
  const activeElement = document.activeElement;
  if(!activeElement || !activeElement.closest('.dropdown-items')) {
    open.value = false;
  } else if(activeElement.previousElementSibling) {
    (<HTMLElement> activeElement.previousElementSibling).focus()
  }
}
</script>

<template>
  <div ref="root" :class="className" @keydown.prevent.down="navigateDown" @keydown.prevent.up="navigateUp" @keydown.esc="open = false">
    <div class="relative">
      <span class="rounded-md shadow-sm">
        <button :id="id" :class="buttonClassName" :aria-expanded="open.toString()" @click="open = !open" >
          <span v-if="label" class="label">{{ $t(label) }}</span>
          <Icon v-if="icon" :name="icon" />
        </button>
      </span>

      <div v-if="open" :aria-labelledby="id" class="absolute dropdown-items right-0 py-2 w-48 bg-main dark:bg-shadow rounded-md shadow-lg border border-gray-100 dark:border-gray-700 z-20" @click="onClickContent">
        <slot></slot>
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
