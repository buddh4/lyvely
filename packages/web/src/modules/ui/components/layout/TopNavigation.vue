<script lang="ts" setup>
import Icon from '@/modules/ui/components/icon/Icon.vue';
import Button from '@/modules/ui/components/button/Button.vue';
import { useAuthStore } from '@/modules/user/store/auth.store';
import { useProfileStore } from '@/modules/profile/stores/profile.store';
import { computed, toRefs } from 'vue';
import { usePageStore } from "@/modules/core/store/page.store";

const pageSotre = usePageStore();
const { toggleSidebar } = pageSotre;
const { showSidebar } = toRefs(pageSotre);

const authenticated = computed(() => useAuthStore().isAuthenticated);
const score = computed(() => useProfileStore().profile?.score);
</script>

<template>
  <nav v-if="authenticated" id="top-navigation" :aria-label="$t('layout.aria.top-nav')">
    <Button class="py-1.5 px-2.5 border-none" :is-toggle="true" :active="!showSidebar" :aria-label="$t('layout.aria.toggle-sidebar')" aria-controls="sidebar" @click="toggleSidebar">
      <Icon name="menu" />
    </Button>

    <div v-if="score" class="score inline-block float-right">

      <transition
        name="score-icon"
        mode="out-in"
        enter-active-class="animate__animated animate_svg_flip" leave-active-class="">
        <Icon :key="score" name="score" class="text-success" />
      </transition>

      <transition
        name="score"
        mode="out-in"
        enter-active-class="animate__animated animate__faster animate__bounceIn"
        leave-active-class="animate__animated animate__faster animate__bounceOut">
        <div :key="score" class="inline-block score-value">
          {{ score }}
        </div>
      </transition>

    </div>
  </nav>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn-main-menu {
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.btn-main-menu:hover {
  color: var(--color-primary) !important;
}

.score-value {
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.icon-score {
  width: 14px;
  margin-top: -4px;
  margin-right: 2px;
  fill: currentColor;
}

.btn-main-menu {
  padding-top: 3px;
  padding-bottom: 6px;
}

.btn-main-menu:hover svg,
.btn-main-menu:active svg {
  fill: var(--color-primary);
}

.navbar-toggle-icon svg {
  width: 15px;
}

@media (max-width: 991.98px) {
  .navbar {
    position: fixed;
    top: 0;
    width: 100%;
  }
}

.animate_svg_flip {
  backface-visibility: visible;
  animation-name: flip_svg;
}

@keyframes flip_svg {
  from {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -360deg);
    animation-timing-function: ease-out;
  }

  40% {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -190deg);
    animation-timing-function: ease-out;
  }

  50% {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -170deg);
    animation-timing-function: ease-in;
  }

  80% {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg);
    animation-timing-function: ease-in;
  }

  to {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg);
    animation-timing-function: ease-in;
  }
}
</style>
