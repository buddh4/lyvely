<script lang="ts" setup>

import { ref, watch, toRefs, defineEmits, nextTick } from 'vue';
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

const root = ref<HTMLElement>();

const { modelValue } = toRefs(props);

let openTimeout: any;
let closeTimeout: any;

watch([modelValue], () => {
  if(openTimeout) clearTimeout(openTimeout);
  if(closeTimeout) clearTimeout(closeTimeout);

  if(modelValue.value) {
    root.value?.classList.remove('hidden');
    openTimeout = setTimeout(() =>  {
      root.value?.classList.add('open')
      root.value?.addEventListener('transitionend', () => suggestFocusElement(root.value)?.focus(), { once: true });
    }, 0);
  } else {
    closeTimeout = setTimeout(() => {
      root.value?.classList.remove('open');
      root.value?.addEventListener('transitionend', () => root.value?.classList.add('hidden'), { once: true });
    }), 0;
  }
});

const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false);
}

</script>

<template>
  <Teleport to="body">
  <section ref="root" :class="['drawer', right ? 'rtl' : 'ltr', 'hidden z-20 min-w-screen']" @keyup.esc="close">
    <div class="h-screen sticky top-0 left-0 flex-col flex-wrap justify-start content-start items-start">
      <div data-drawer-header class="mb-4 flex items-center pb-3 rounded-t-sm">
        <slot name="headerheader">
          <h1 v-if="title" class="font-bold">{{ $t(title) }}</h1>
          <Button class="float-right align-middle font-bold ml-auto px-2 py-0.5 border-none" @click="close">
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
  transition: all 0.35s ease-in-out;
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

@media (max-width: 768px) {
  .drawer {
    max-width: 95vw;
    width: 95vw;
  }

  .drawer.ltr {
    margin-left: -95vw;
  }

  .drawer.rtl {
    margin-right: -95vw;
  }
}
</style>
