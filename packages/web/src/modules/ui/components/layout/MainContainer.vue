<script lang="ts" setup>
import { computed } from "vue";
import { Size } from "@/modules/ui/types";
import { useAuthStore } from "@/modules/users/store/auth.store";

interface Props {
  width?: "xs" | "sm" | "lg" | "xl" | "full";
  // TODO: GUEST - check guest access config
  requireAuth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: Size.LG,
  requireAuth: true,
});

const widthClass = computed(
  () =>
    ((
      {
        [Size.SM]: "max-w-screen-sm",
        [Size.LG]: "max-w-screen-lg",
        [Size.XL]: "max-w-screen-xl",
        [Size.XS]: "max-w-screen-xs",
        [Size.Full]: "max-w-full",
      } as Record<string, string>
    )[props.width] || "max-w-screen-lg")
);

const classNames = computed(() => {
  return [
    "container main-container mx-auto p-0.5 pb-5 pt-2 md:p-6 mb-6 md:mb-0",
    widthClass.value,
  ];
});
</script>

<template>
  <div class="overflow-y-auto overflow-x-hidden">
    <main :class="classNames">
      <slot></slot>
    </main>
  </div>
</template>

<style>
@media (max-width: 767px) {
  .main-container {
    min-width: 100vw;
  }
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
