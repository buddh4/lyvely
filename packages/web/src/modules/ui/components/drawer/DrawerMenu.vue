<script lang="ts" setup>
import { ref, toRefs } from "vue";
import { suggestFocusElement } from "@/modules/ui/utils";

interface Props {
  modelValue: boolean;
  title?: string;
  prevAutoFocus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  prevAutoFocus: false,
});

const emit = defineEmits(["update:modelValue"]);
const root = ref<HTMLElement>();
const { modelValue } = toRefs(props);

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
        ref="root"
        :class="['drawer', 'z-20']"
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
.drawer {
  @apply p-4 shadow-lg bg-highlight rounded-l;
  position: absolute;
  display: block;
  top: 60px;
  height: calc(100vh - 70px);
  bottom: 0;
  min-width: 280px;
  max-width: 280px;
  background: var(--elements-main);
  border: 1px solid var(--color-divide);
  border-right: 0;
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
