<script lang="ts" setup>
import { MENU_PROFILE_MOBILE_FOOTER } from '@/profiles/profile.constants';
import { useProfileMenu } from '@/profiles/composables';
import { LyMenuEntry } from '@lyvely/ui';

export interface IProps {
  state: boolean;
}

defineProps<IProps>();

const { enabledMenuEntries } = useProfileMenu(MENU_PROFILE_MOBILE_FOOTER);
</script>

<template>
  <transition name="slide-fade">
    <nav
      v-if="state"
      id="page-footer"
      class="footer bg-main w-full shrink-0 overflow-hidden py-1 shadow md:hidden">
      <div class="flex justify-center">
        <div class="navbar-nav justify-content-center flex flex-row">
          <ly-menu-entry
            v-for="entry in enabledMenuEntries"
            :key="entry.id"
            :entry="entry"
            :show-labels="false"
            class="nav-link" />
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

#page-footer {
  width: 100dvw;
}

#page-footer .navbar-nav {
  flex-direction: row;
  justify-content: center;
}

#page-footer .navbar-nav .nav-link {
  @apply mx-7;
  padding: 0;
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
