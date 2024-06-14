<script lang="ts" setup>
import { computed, Ref, ref, toRefs, useAttrs, watch } from 'vue';
import { uniqueId } from '@lyvely/common';
import { isMaxViewSize, suggestFocusElement, watchMaxSize } from '@/helpers';
import { useInfiniteScroll, useSwipe } from '@vueuse/core';
import { useDrawerStore } from '@/components/drawers/drawer.store';
import { t, Translatable } from '@/i18n';
import LyButton from '@/components/buttons/LyButton.vue';
import LyIcon from '@/components/icons/LyIcon.vue';

defineOptions({
  inheritAttrs: false,
});

export interface IProps {
  modelValue: boolean;
  id?: string;
  title?: Translatable;
  prevAutoFocus?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  id: undefined,
  title: undefined,
  prevAutoFocus: false,
});

const drawerId = uniqueId('drawer');
const zIndex = ref(20);

const attrs = useAttrs();
const emit = defineEmits(['update:modelValue', 'infiniteScroll']);
const root = ref<HTMLElement>() as Ref<HTMLElement>;
const { modelValue } = toRefs(props);
const { pushDrawer, popDrawer } = useDrawerStore();

watch(modelValue, (value) => {
  if (value) {
    zIndex.value = pushDrawer(drawerId) + 900;
  } else {
    popDrawer(drawerId);
    zIndex.value = 900;
  }
});

const isSmallView = ref(isMaxViewSize('sm'));
watchMaxSize('sm', (value) => {
  isSmallView.value = value;
});

function close() {
  emit('update:modelValue', false);
}

function autoFocus() {
  suggestFocusElement(root.value)?.focus();
}

const body = ref<HTMLElement | null>(null);
useInfiniteScroll(
  body,
  () => {
    emit('infiniteScroll');
  },
  { distance: 10 }
);

const { direction } = useSwipe(root, {
  onSwipeEnd(e: TouchEvent) {
    if (modelValue.value && direction.value === 'right') {
      e.stopPropagation();
      close();
    }
  },
});

// Workaround due to conflicting HtmlAttribute types of docs/react
const style = computed<any>(() => ({ 'z-index': zIndex.value }));
</script>

<template>
  <teleport to="body">
    <transition name="fade-fast">
      <div
        v-if="modelValue && isSmallView"
        class="fixed inset-0 z-40 bg-black opacity-50 md:hidden"
        @mousedown="close"
        @touchstart="close"></div>
    </transition>

    <transition name="slide-fade" @after-enter="autoFocus">
      <section
        v-if="modelValue"
        :id="id"
        ref="root"
        class="drawer"
        :style="style"
        v-bind="attrs"
        @keyup.esc="close">
        <div class="flex h-full flex-col items-stretch">
          <div data-drawer-header class="flex items-center rounded-t-sm px-4 pb-3 pt-4">
            <slot name="header">
              <h1 v-if="title" class="text-base font-bold">{{ t(title) }}</h1>
              <ly-button
                class="float-right ml-auto border-none px-2 py-0.5 align-middle font-bold"
                @click="close">
                <ly-icon name="arrow-right" class="text-main" />
              </ly-button>
            </slot>
          </div>
          <div ref="body" data-drawer-body class="scrollbar-thin overflow-auto">
            <slot></slot>
          </div>
          <div data-drawer-footer class="grow px-4 pb-4 pt-3">
            <slot name="footer"></slot>
          </div>
        </div>
      </section>
    </transition>
  </teleport>
</template>

<style scoped lang="postcss">
.drawer {
  @apply bg-highlight;
  position: fixed;
  top: 46px;
  right: 0;
  height: calc(100svh - 46px);

  min-width: 280px;
  max-width: 280px;
  background: var(--elements-main);

  will-change: transform;
  contain: paint;
  margin-right: 0;
}

@media (max-width: 767px) {
  .drawer {
    top: 0;
    height: 100svh;
  }
}

/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  transition-property: transform, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-out;
}

.slide-fade-leave-active {
  transition-property: transform, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0.9;
}
</style>
