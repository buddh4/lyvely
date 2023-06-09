<script lang="ts" setup>
import { computed } from 'vue';
import { Size } from '@/types';
import { t } from '@/i18n';

export interface IProps {
  title?: string;
  width?: 'xs' | 'sm' | 'lg' | 'xl' | 'full';
  translate?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  title: '',
  width: 'sm',
  translate: true,
});

const widthClass = computed(
  () =>
    ((
      {
        [Size.SM]: 'max-w-sm',
        [Size.LG]: 'max-w-lg',
        [Size.XL]: 'max-w-xl',
        [Size.XS]: 'max-w-xs',
        [Size.Full]: 'max-w-full',
      } as Record<string, string>
    )[props.width] || 'max-w-sm'),
);
</script>

<template>
  <section class="flex md:p-4 justify-center md:rounded md:h-screen w-full">
    <div class="flex flex-col gap-4 w-full md:min-h-0 md:max-h-auto m-auto" :class="widthClass">
      <div
        class="bg-main main h-screen-s md:h-auto border-divide md:border p-4 shadow-xl md:rounded">
        <slot name="header">
          <h1 class="text-center text-xl">
            <slot name="title">{{ translate ? t(title) : title }}</slot>
          </h1>
        </slot>

        <div class="my-5">
          <slot name="body"></slot>
        </div>

        <div>
          <slot name="footer"></slot>
        </div>

        <div class="block md:hidden my-4">
          <slot name="links" />
        </div>
      </div>
      <div class="hidden md:block">
        <slot name="links" />
      </div>
    </div>
  </section>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
