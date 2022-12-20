<script lang="ts" setup>
import { computed, ref, toRefs, useSlots, watch } from 'vue';
import { uniqueId } from 'lodash';
import { suggestFocusElement } from '@/modules/ui/utils';
import { usePageStore } from '@/modules/core/store/page.store';
import { useInfiniteScroll } from '@vueuse/core';

export interface IProps {
  modelValue: boolean;
  id?: string;
  title?: string;
  prevAutoFocus?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  id: undefined,
  title: undefined,
  prevAutoFocus: false,
});

const pageStore = usePageStore();

const drawerId = uniqueId('drawer');
const zIndex = ref(20);

const emit = defineEmits(['update:modelValue', 'infiniteScroll']);
const root = ref<HTMLElement>();
const { modelValue } = toRefs(props);

watch(modelValue, (value) => {
  if (value) {
    zIndex.value = pageStore.pushDrawer(drawerId) + 900;
  } else {
    pageStore.popDrawer(drawerId);
    zIndex.value = 900;
  }
});

function close() {
  emit('update:modelValue', false);
}

function autoFocus() {
  suggestFocusElement(root.value)?.focus();
}

const hasFooter = computed(() => {
  return !!useSlots().footer;
});

const body = ref<HTMLElement>(null);
useInfiniteScroll(
  body,
  () => {
    emit('infiniteScroll');
  },
  { distance: 10 },
);
</script>

<template>
  <teleport to="body">
    <transition name="slide-fade" @after-enter="autoFocus">
      <section
        v-if="modelValue"
        :id="id"
        ref="root"
        :class="['drawer']"
        :style="{ 'z-index': zIndex }"
        @keyup.esc="close">
        <div
          class="max-h-full flex items-stretch flex-col top-0 left-0 flex-col justify-start content-start items-start">
          <div data-drawer-header class="mb-4 flex items-center pb-3 rounded-t-sm">
            <slot name="header">
              <h1 v-if="title" class="font-bold">{{ $t(title) }}</h1>
              <ly-button
                class="float-right align-middle font-bold ml-auto px-2 py-0.5 border-none"
                @click="close">
                x
              </ly-button>
            </slot>
          </div>
          <div ref="body" data-drawer-body class="overflow-auto scrollbar-thin">
            <slot></slot>
          </div>
          <div v-if="hasFooter" data-drawer-footer class="pt-3">
            <slot name="footer"></slot>
          </div>
        </div>
      </section>
    </transition>
  </teleport>
</template>

<style scoped lang="postcss">
h1 {
  @apply text-base;
}
.drawer {
  @apply p-4 shadow-lg bg-highlight;
  position: absolute;
  display: block;
  top: 55px;
  height: calc(100vh - 55px);
  bottom: 0;
  min-width: 280px;
  max-width: 280px;
  background: var(--elements-main);
  border: 1px solid var(--color-divide);
  border-right: 0;
  border-top: 0;
  border-bottom: 0;
  transition: all 0.3s ease-out;
  margin-right: 0;
  right: 0;
}

/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(280px);
  opacity: 0.9;
}

@media (max-width: 768px) {
}
</style>
