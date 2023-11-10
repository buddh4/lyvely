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

const computedIconClass = computed(() =>
  twMerge(props.iconClass, 'fill-current text-lyvely mr-2 w-6'),
);
</script>

<template>
  <section class="flex md:p-4 justify-center md:rounded md:h-screen w-full">
    <div class="flex flex-col gap-4 w-full md:min-h-0 md:max-h-auto m-auto" :class="widthClass">
      <div
        class="bg-main main h-screen-s md:h-auto border-divide md:border p-4 shadow-xl md:rounded">
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
