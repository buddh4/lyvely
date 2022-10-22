<script lang="ts" setup>
import { computed } from "vue";
import { Size } from "@/modules/ui/types";

interface IProps {
  title?: string;
  width?: "xs" | "sm" | "lg" | "xl" | "full";
}

const props = withDefaults(defineProps<IProps>(), {
  title: undefined,
  width: "sm",
});

const widthClass = computed(
  () =>
    ((
      {
        [Size.SM]: "max-w-sm",
        [Size.LG]: "max-w-lg",
        [Size.XL]: "max-w-xl",
        [Size.XS]: "max-w-xs",
        [Size.Full]: "max-w-full",
      } as Record<string, string>
    )[props.width] || "max-w-sm")
);
</script>

<template>
  <section class="flex md:p-4 justify-center md:rounded md:h-screen w-full">
    <div
      :class="[
        'bg-main main w-full p-4 md:border h-screen md:h-auto border-divide md:rounded shadow-xl m-auto',
        widthClass,
      ]"
    >
      <slot name="header">
        <h1 class="text-center text-xl">
          <slot name="title">{{ $t(props.title) }}</slot>
        </h1>
      </slot>

      <div class="my-5">
        <slot name="body"></slot>
      </div>

      <div>
        <slot name="footer"></slot>
      </div>
    </div>
  </section>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
