<script lang="ts" setup>
import { usePageStore } from '@/ui';
import { computed } from 'vue';
import { useProfileStore } from '@/profiles/stores/profile.store';
import ProfileRelationsChooser from './ProfileRelationsChooser.vue';
import { getScaledProgress } from '@lyvely/interface';
import ProfileAvatar from '@/profiles/components/ProfileAvatar.vue';
import { t } from '@/i18n';

const profileStore = useProfileStore();
const pageStore = usePageStore();

const { toggleSidebar } = pageStore;
const score = computed(() => profileStore.profile?.score ?? 0);
const formattedScore = computed(() => {
  if (!score.value) return 0;

  return Intl.NumberFormat('en-us', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(score.value);
});

const progress = computed(() => getScaledProgress(score.value || 0));
</script>

<template>
  <ly-dropdown position="right">
    <template #trigger="{ toggle }">
      <div data-id="profile-combo-button" class="flex justify-center items-stretch">
        <ly-button
          class="border border-divide border-r-0 rounded-l-2xl px-3 py-2"
          @click="toggleSidebar">
          <ly-icon name="menu" class="w-3" style="margin-top: -3px" />
        </ly-button>

        <div
          role="button"
          class="border border-divide flex justify-center items-center gap-2 px-3"
          :aria-label="t('layout.aria.toggle-sidebar')"
          aria-controls="sidebar"
          @click="toggleSidebar">
          <profile-avatar data-id="active-profile-avatar" class="md:hidden" />

          <div class="flex flex-col">
            <div class="flex justify-center items-center text-xs">
              <transition
                name="score-icon"
                mode="out-in"
                enter-active-class="animate__animated animate_svg_flip"
                leave-active-class="">
                <ly-icon :key="score" name="score" class="text-success" />
              </transition>

              <transition
                name="score"
                mode="out-in"
                enter-active-class="animate__animated animate__faster animate__bounceIn"
                leave-active-class="animate__animated animate__faster animate__bounceOut">
                <div :key="score" class="inline-block score-value ml-0.5">
                  <span>{{ formattedScore }}</span>
                </div>
              </transition>
            </div>

            <ly-progress-bar class="h-1.5" :progress="progress" />
          </div>
        </div>

        <ly-button
          data-id="btn-toggle-profile-relations"
          class="border border-divide border-l-0 rounded-r-2xl px-3"
          @click="toggle">
          <ly-icon style="margin-top: -1px" name="caret-down" />
        </ly-button>
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
