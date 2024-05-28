<script lang="ts" setup>
import { computed } from 'vue';
import { Size } from '@/types';
import LyIcon from '../icons/LyIcon.vue';
import { t, Translatable } from '@/i18n';
import { twMerge } from 'tailwind-merge';

export interface IProps {
  title?: Translatable;
  width?: 'xs' | 'sm' | 'lg' | 'xl' | 'full';
  icon?: string;
  iconClass?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  title: '',
  width: 'sm',
  icon: 'lyvely',
  iconClass: '',
});

const widthClass = computed(
  () =>
    (
      ({
        [Size.SM]: 'max-w-sm',
        [Size.LG]: 'max-w-lg',
        [Size.XL]: 'max-w-xl',
        [Size.XS]: 'max-w-xs',
        [Size.Full]: 'max-w-full',
      }) as Record<string, string>
    )[props.width] || 'max-w-sm',
);

const computedIconClass = computed(() =>
  twMerge(props.iconClass, 'fill-current text-lyvely mr-2 w-6'),
);
</script>

<template>
  <section class="flex w-full justify-center md:h-screen md:rounded md:p-4">
    <div class="md:max-h-auto m-auto flex w-full flex-col gap-4 md:min-h-0" :class="widthClass">
      <div
        class="main h-screen-s border-divide bg-main p-4 shadow-xl md:h-auto md:rounded md:border">
        <slot name="header">
          <div class="flex items-center justify-center">
            <ly-icon v-if="icon?.length" :class="computedIconClass" :name="icon" />
            <h1 class="text-base font-bold">
              <slot name="title">{{ t(title) }}</slot>
            </h1>
          </div>
        </slot>

        <div class="my-5">
          <slot name="body"></slot>
        </div>

        <div>
          <slot name="footer"></slot>
        </div>

        <div class="my-4 block md:hidden">
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
