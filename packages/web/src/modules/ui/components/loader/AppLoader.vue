<script lang="ts" setup>
import { usePageStore } from "@/modules/core/store/page.store";
import { toRefs } from "vue";

const { showAppLoader } = toRefs(usePageStore());
</script>

<template>
  <transition name="fade">
    <div v-if="showAppLoader" class="overlay bg-main">
      <div class="overlay__inner">
        <div class="overlay__content">
          <span class="spinner border-divide border-t-pop"></span>
        </div>
        <div class="overlay__content">
          <ly-icon name="lyvely" class="text-lyvely w-8" />
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.overlay {
  z-index: 99999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: fixed;
}

.overlay__inner {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: absolute;
}

.overlay__content {
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}

.spinner {
  width: 75px;
  height: 75px;
  display: inline-block;
  border-width: 2px;
  animation: spin 1s infinite linear;
  border-radius: 100%;
  border-style: solid;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
