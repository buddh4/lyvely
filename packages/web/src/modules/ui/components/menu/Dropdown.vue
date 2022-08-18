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

const root = ref(null);

onClickOutside(root, (event) => open.value = false);

const className = ['flex','dropdown'];
const buttonClassName = ['inline-flex justify-center  leading-5 z-10 block rounded-md bg-white p-3 focus:outline-none', props.buttonClass];

const id = uniqueId('dropdown-');
const { icon, label } = toRefs(props);

function onClickContent(evt: { target: HTMLElement }) {
  if(!evt.target.classList.contains('prev-close')) {
    open.value = false;
  }
  console.log(evt);
}
</script>

<template>
  <div ref="root" :class="className">
    <div class="relative">
      <span class="rounded-md shadow-sm">
        <button :id="id" :class="buttonClassName" :aria-expanded="open.toString()" @click="open = !open">
          <span v-if="label" class="label">{{ $t(label) }}</span>
          <Icon v-if="icon" :name="icon" />
        </button>
      </span>

      <div v-if="open" :aria-labelledby="id" class="absolute right-0 py-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 z-20" @click="onClickContent">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown .label + svg {
  @apply ml-2;
}
</style>
