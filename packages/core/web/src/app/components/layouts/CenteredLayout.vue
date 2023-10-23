<script setup lang="ts">
//import LegalLinks from '@/legal/components/LegalLinks.vue';
import { LyCenteredPanel } from '@lyvely/ui';

export interface IProps {
  title?: string;
  width?: 'xs' | 'sm' | 'lg' | 'xl' | 'full';
}

const props = withDefaults(defineProps<IProps>(), {
  title: '',
  width: 'sm',
});
</script>

<template>
  <ly-centered-panel v-bind="props">
    <template #header>
      <slot name="header">
        <h1 class="text-center text-xl">
          <slot name="title">{{ $t(title) }}</slot>
        </h1>
      </slot>
    </template>

    <template #body>
      <slot name="body"></slot>
    </template>

    <template #footer>
      <slot name="footer"></slot>
    </template>

    <template #links>
      <!-- legal-links / -->
      <slot name="links" />
    </template>
  </ly-centered-panel>
</template>

<style scoped></style>
