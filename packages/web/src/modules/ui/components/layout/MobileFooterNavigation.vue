<script lang="ts" setup>
import Icon from "@/modules/ui/components/icon/Icon.vue";
import { computed } from 'vue';
import { useAuthStore } from '@/modules/user/store/auth.store';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>

<template>
  <footer
    v-if="isAuthenticated"
    id="page-footer"
    class="footer mt-auto py-2 bg-white md:hidden">
    <div class="">
      <div class="navbar-nav flex flex-row justify-content-center">
        <router-link class="nav-link" to="/activities">
          <Icon name="activity" />
        </router-link>

        <router-link class="nav-link" to="/journal">
          <Icon name="journal" />
        </router-link>

        <router-link class="nav-link" to="/statistics">
          <Icon name="statistics" />
        </router-link>
      </div>
    </div>
  </footer>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.navbar-nav .icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  margin: 5px;
}

#page-footer {
  @apply text-gray-500;
  padding: 5px;
  box-shadow: 0 -2px 3px 0 rgba(0, 0, 0, 0.11);
  -webkit-box-shadow: 0 -2px 3px 0 rgba(0, 0, 0, 0.11);
  -moz-box-shadow: 0 -2px 3px 0 rgba(0, 0, 0, 0.11);
  backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
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

@media (max-width: 991.98px) {
  #page-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
}
</style>
