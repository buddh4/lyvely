<script lang="ts" setup>
import { ref, computed } from 'vue';

const slider = ref<HTMLElement>();
const container = ref<HTMLElement>();
const slideActive = ref(false);
const slideX = ref(0);
const slideTransformX = ref(0);

const getX = (evt: MouseEvent | TouchEvent) =>
  evt instanceof MouseEvent ? evt.clientX : evt.touches[0].clientX;

function beginSlide(evt: MouseEvent | TouchEvent) {
  if (!container.value || !slider.value) {
    return;
  }

  const overflow = slider.value.offsetWidth - container.value.offsetWidth - 2;

  if (overflow <= 0) {
    return;
  }

  slideX.value = getX(evt);

  const slideHandler = (evt: MouseEvent | TouchEvent) => slide(evt, overflow);
  const endSlide = () => {
    slideActive.value = false;
    document.removeEventListener('mousemove', slideHandler);
    document.removeEventListener('touchmove', slideHandler);
  };

  document.addEventListener('mouseup', endSlide, { once: true });
  document.addEventListener('touchend', endSlide, { once: true });
  document.addEventListener('mousemove', slideHandler);
  document.addEventListener('touchmove', slideHandler);
}

function slide(evt: MouseEvent | TouchEvent, overflow: number) {
  const clientX = getX(evt);
  const diff = Math.abs(slideX.value - clientX);

  if (diff < 5) {
    return;
  } else if (!slideActive.value) {
    slideActive.value = true;
  }

  slideTransformX.value =
    slideX.value > clientX
      ? Math.max(slideTransformX.value - diff, -overflow)
      : Math.min(0, slideTransformX.value + diff);

  slideX.value = clientX;
}

const sliderStyle = computed(() => {
  return {
    transform: `translateX(${slideTransformX.value}px)`,
    'pointer-events': slideActive.value ? 'none' : ('all' as 'none' | 'all'),
  };
});
</script>

<template>
  <div
    ref="container"
    class="no-swipe flex tag-filter-selection overflow-x-hidden whitespace-nowrap relative mr-1">
    <div
      ref="slider"
      :style="sliderStyle"
      class="inline-flex slider-nav touch-pan-y slider-nav flex"
      @mousedown="beginSlide"
      @touchstart="beginSlide">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.slider-nav {
  transition-duration: 0.15s;
  transition-timing-function: cubic-bezier(0.05, 0, 0, 1);
  will-change: transform;
  white-space: nowrap;
}
</style>
