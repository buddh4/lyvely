<script lang="ts" setup>
import { usePageStore } from '@/modules/core/store/page.store';
import { computed } from 'vue';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import ProfileRelationsChooser from './ProfileRelationsChooser.vue';
import { getScaledProgress } from '@lyvely/common';
import ProfileAvatar from '@/modules/profiles/components/ProfileAvatar.vue';

const profileStore = useProfileStore();
const pageStore = usePageStore();

const { toggleSidebar } = pageStore;
const score = computed(() => profileStore.profile?.score ?? 0);
const formattedScore = computed(() => {
  if (!score.value) return 0;

  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(score.value);
});

const progressStyle = computed(() => {
  return {
    width: getScaledProgress(score.value || 0) * 100 + '%',
  };
});
</script>

<template>
  <ly-dropdown position="right">
    <template #trigger="{ toggle }">
      <div id="profile-combo-button" class="flex justify-center items-center py-1">
        <div class="border border-divide border-r-0 rounded-l-2xl flex justify-center items-center">
          <ly-button class="px-3 py-2" @click="toggleSidebar">
            <ly-icon name="menu" style="margin-top: -3px" />
          </ly-button>
        </div>

        <div
          role="button"
          class="border-none px-0"
          :aria-label="$t('layout.aria.toggle-sidebar')"
          aria-controls="sidebar"
          @click="toggleSidebar">
          <div class="border border-divide px-3 p-2 flex justify-center items-center gap-2">
            <profile-avatar />

            <div class="flex flex-col">
              <div class="flex justify-center items-center text-xs">
                <transition
                  name="score-icon"
                  mode="out-in"
                  enterActiveClass="animate__animated animate_svg_flip"
                  leaveActiveClass="">
                  <ly-icon :key="score" name="score" class="text-success" />
                </transition>

                <transition
                  name="score"
                  mode="out-in"
                  enterActiveClass="animate__animated animate__faster animate__bounceIn"
                  leaveActiveClass="animate__animated animate__faster animate__bounceOut">
                  <div :key="score" class="inline-block score-value ml-0.5">
                    <span>{{ formattedScore }}</span>
                  </div>
                </transition>
              </div>
              <div class="border border-divide rounded-full w-full h-1.5">
                <div
                  class="score-progress float-right bg-success rounded-full w-2 h-full"
                  :style="progressStyle"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="border border-divide border-l-0 rounded-r-2xl flex justify-center items-center">
          <ly-button class="px-3 py-2" @click="toggle">
            <ly-icon style="margin-top: -1px" name="caret-down" />
          </ly-button>
        </div>
      </div>
    </template>

    <template #default>
      <suspense>
        <profile-relations-chooser />
        <template #fallback>
          <ly-loader />
        </template>
      </suspense>
    </template>
  </ly-dropdown>
</template>

<style scoped>
.score-progress {
  transition: width 2s ease-in;
}

.score-value {
  min-width: 1em;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.icon-score {
  width: 14px;
  margin-top: -4px;
  margin-right: 2px;
  fill: currentColor;
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
