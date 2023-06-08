<script setup lang="ts">
import LegalLinks from '@/modules/legal/components/LegalLinks.vue';

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
  <ly-centered-layout v-bind="props">
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
      <legal-links />
      <slot name="links" />
    </template>
  </ly-centered-layout>
</template>

<style scoped></style>
