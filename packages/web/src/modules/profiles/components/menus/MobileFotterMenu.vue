<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useActivityStore } from '@/modules/activities/store/activity.store';

export interface IProps {
  state: boolean;
}

defineProps<IProps>();

const { activeView } = storeToRefs(useActivityStore());
</script>

<template>
  <transition name="slide-fade">
    <nav
      v-if="state"
      id="page-footer"
      class="footer p-4 shadow overflow-hidden w-full py-2 bg-main md:hidden">
      <div class="flex justify-center">
        <div class="navbar-nav flex flex-row justify-content-center">
          <router-link class="nav-link" :to="{ name: 'stream' }">
            <ly-icon name="stream" class="text-main" />
          </router-link>

          <router-link class="nav-link" :to="{ name: activeView }">
            <ly-icon name="activity" class="text-main" />
          </router-link>

          <router-link class="nav-link" :to="{ name: 'Journals' }">
            <ly-icon name="journal" class="text-main" />
          </router-link>
        </div>
      </div>
    </nav>
  </transition>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.navbar-nav .icon {
  display: inline-block;
  width: 1.1em;
  height: 1.1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  margin: 5px;
}

#page-footer .navbar-nav {
  flex-direction: row;
  justify-content: center;
}

#page-footer .navbar-nav .nav-link {
  @apply mx-7;
  padding: 0;
  color: var(--bs-gray);
}

#page-footer .router-link-active {
  border-bottom: 2px solid #48ce48;
}

.slide-fade-enter-active {
  transition-property: transform, opacity;
  transition-duration: 0.3s;
  transition-timing-function: ease-out;
}

.slide-fade-leave-active {
  transition-property: transform, opacity;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(280px);
  opacity: 0.9;
}
</style>
