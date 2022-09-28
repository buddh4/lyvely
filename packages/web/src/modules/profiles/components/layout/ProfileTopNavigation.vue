<script lang="ts" setup>
import { computed } from "vue";
import { usePageStore } from "@/modules/core/store/page.store";
import ProfileBreadcrumb from "@/modules/profiles/components/ProfileBreadcrumb.vue";
import { useProfileStore } from "@/modules/profiles/stores/profile.store";
import ProfileRelationsChooser from "@/modules/profiles/components/ProfileRelationsChooser.vue";

const profileStore = useProfileStore();
const pageStore = usePageStore();

const { toggleSidebar } = pageStore;

const score = computed(() => profileStore.profile?.score);
</script>

<template>
  <nav
    id="top-navigation"
    class="flex items-center justify-between no-wrap overflow-hidden p-0.5 px-2 z-40 shadow dark:shadow-slate-900 overflow-visible"
    :aria-label="$t('layout.aria.top-nav')"
  >
    <div class="w-1/3">
      <ly-dropdown position="right">
        <template #trigger="{ toggle }">
          <div class="flex justify-center items-center py-1">
            <div
              class="border border-divide border-r-0 rounded-l-2xl flex justify-center items-center"
            >
              <ly-button class="px-3 py-2" @click="toggleSidebar">
                <ly-icon name="menu" style="margin-top: -3px" />
              </ly-button>
            </div>

            <div
              role="button"
              class="border-none px-0"
              :aria-label="$t('layout.aria.toggle-sidebar')"
              aria-controls="sidebar"
              @click="toggleSidebar"
            >
              <div
                class="border border-divide px-3 p-2 flex justify-center items-center gap-2"
              >
                <ly-profile-avatar />

                <div class="flex justify-center items-center text-xs">
                  <transition
                    name="score-icon"
                    mode="out-in"
                    enter-active-class="animate__animated animate_svg_flip"
                    leave-active-class=""
                  >
                    <ly-icon :key="score" name="score" class="text-success" />
                  </transition>

                  <transition
                    name="score"
                    mode="out-in"
                    enter-active-class="animate__animated animate__faster animate__bounceIn"
                    leave-active-class="animate__animated animate__faster animate__bounceOut"
                  >
                    <div :key="score" class="inline-block score-value ml-0.5">
                      {{ score }}
                    </div>
                  </transition>
                </div>
              </div>
            </div>
            <div
              class="border border-divide border-l-0 rounded-r-2xl flex justify-center items-center"
            >
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
    </div>

    <div class="w-1/3 flex justify-center">
      <div
        class="border border-divide px-3 p-2 rounded-2xl text-sm hidden sm:inline-block"
      >
        <profile-breadcrumb />
      </div>
    </div>

    <div
      class="w-1/3 flex items-center justify-end score inline-block float-right"
    >
      <ly-button>
        <ly-icon name="bell" class="w-3.5" />
      </ly-button>
      <ly-dropdown
        class="border-none"
        :is-toggle="true"
        :aria-label="$t('layout.aria.toggle-sidebar')"
        aria-controls="sidebar"
      >
        <template #trigger>
          <div
            class="px-2 p-2 rounded-xl flex justify-center items-center gap-2 cursor-pointer text-sm"
          >
            <ly-user-avatar />
            <ly-icon name="caret-down" />
          </div>
        </template>
      </ly-dropdown>
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

@media (max-width: 767px) {
  #top-navigation {
    min-width: 100vw;
  }
}

.animate_svg_flip {
  backface-visibility: visible;
  animation-name: flip_svg;
}

@keyframes flip_svg {
  from {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, -360deg);
    animation-timing-function: ease-out;
  }

  40% {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, -190deg);
    animation-timing-function: ease-out;
  }

  50% {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, -170deg);
    animation-timing-function: ease-in;
  }

  80% {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, 0deg);
    animation-timing-function: ease-in;
  }

  to {
    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, 0deg);
    animation-timing-function: ease-in;
  }
}
</style>
