<script lang="ts" setup>
import { ref, toRefs, watch } from "vue";
import { uniqueId } from "lodash";
import { storeToRefs } from "pinia";
import { suggestFocusElement } from "@/modules/ui/utils";
import { usePageStore } from "@/modules/core/store/page.store";

const pageStore = usePageStore();

const { activeDrawer } = storeToRefs(pageStore);

interface IProps {
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

const drawerId = uniqueId("drawer");
const zIndex = ref(20);

const emit = defineEmits(["update:modelValue"]);
const root = ref<HTMLElement>();
const { modelValue } = toRefs(props);

watch(modelValue, (value) => {
  if (value) {
    activeDrawer.value = drawerId;
  }
});

watch<string | undefined>(activeDrawer, (value: string | undefined) => {
  zIndex.value = value === drawerId ? 22 : 21;
});

function close() {
  emit("update:modelValue", false);
}

function autoFocus() {
  suggestFocusElement(root.value)?.focus();
}
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
        @keyup.esc="close"
      >
        <div
          class="h-screen sticky top-0 left-0 flex-col flex-wrap justify-start content-start items-start"
        >
          <div
            data-drawer-header
            class="mb-4 flex items-center pb-3 rounded-t-sm"
          >
            <slot name="headerheader">
              <h1 v-if="title" class="font-bold">{{ $t(title) }}</h1>
              <ly-button
                class="float-right align-middle font-bold ml-auto px-2 py-0.5 border-none"
                @click="close"
              >
                x
              </ly-button>
            </slot>
          </div>
          <div data-drawer-body>
            <slot></slot>
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
  border-top:0;
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
