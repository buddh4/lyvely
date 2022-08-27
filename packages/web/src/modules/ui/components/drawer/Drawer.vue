<script lang="ts" setup>

import { ref, watch, toRefs, defineEmits } from 'vue';
import { suggestFocusElement } from "@/modules/ui/utils";
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import Icon from '@/modules/ui/components/icon/Icon.vue';

interface Props {
  modelValue: boolean
  title?: string,
  right?: boolean,
  prevAutoFocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  right: true,
  prevAutoFocus: false
})

const root = ref<HTMLElement|null>(null);

function toggleNav() {
  setMinNavMargin( (getMainNavMargin() === '0px') ? '280px' : '0px');
}

function getMainNavMargin(): string {
  return root.value ? window.getComputedStyle(root.value).marginLeft : '0px';
}

function setMinNavMargin(val: string) {
  if(root.value) {
    root.value.style.marginLeft = val;
  }
}

const { modelValue } = toRefs(props);

if(!props.prevAutoFocus) {
  watch([modelValue], () => {

    if(!modelValue.value) {
    //  deactivate();
      return;
    }

    //useAccessibilityStore().setAriaHiddenApp(modelValue.value);
    setTimeout(() => {
      if(root.value) {
   //     activate();
        suggestFocusElement(root.value)?.focus()
      }
    },900);
  });
}

const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false);
}

defineExpose({ toggleNav });
</script>

<template>
  <Teleport to="body">
  <section ref="root" :class="['drawer', right ? 'rtl' : 'ltr', modelValue ? 'open' : '', 'z-20']">
    <div class="h-screen sticky top-0 left-0 flex-col flex-wrap justify-start content-start items-start">
      <div data-drawer-header class="mb-4 flex items-center pb-3 rounded-t-sm">
        <slot name="headerheader">
          <button
              aria-hidden="true"
              role="button"
              class="align-middle inline-block mr-2 md:hidden border-none"
              @click="close">
            <Icon name="back" css-class="w-3.5"/>
          </button>
          <h1 v-if="title" class="font-bold">{{ $t(title) }}</h1>
          <Button class="float-right align-middle font-bold ml-auto hidden md:inline-block px-2 py-0.5 border-none" @click="close">
            x
          </Button>
        </slot>
      </div>
      <div data-drawer-body>
        <slot></slot>
      </div>
    </div>
  </section>
  </Teleport>
</template>

<style scoped lang="postcss">
.drawer {
  @apply p-4 shadow-lg;
  position: absolute;
  top:60px;
  height: calc(100vh - 70px);
  bottom:0;
  min-width: 280px;
  max-width: 280px;
  background: var(--elements-main);
  border: 1px solid var(--color-divide);
  border-right:0;
  opacity: 0;
}

.drawer.ltr {
  @apply rounded-r;
  margin-left: -280px;
}

.drawer.rtl {
  @apply rounded-l;
  margin-right: -280px;
}

.drawer.ltr.open {
  margin-left: 0;
  opacity: 1;
}

.drawer.rtl.open {
  margin-right: 0;
  opacity: 1;
}

.drawer.rtl {
  right: 0;
}

.drawer.ltr {
  transition: all 0.35s ease-in-out;
}

.drawer.rtl {
  transition: all 0.35s ease-in-out;
}

@media (max-width: 991.98px) {
  .sidebar.left {
    margin-left: -280px;
  }

  .sidebar.right {
    margin-right: -280px;
  }
}
</style>
