<script lang="ts" setup>

import { ref } from 'vue';

interface Props {
  modelValue: boolean
  title?: string,
  right?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  right: true
})

const root = ref<HTMLElement|null>(null);

function toggleNav() {
  setMinNavMargin( (getMainNavMargin() === '0px') ? '260px' : '0px');
}

function getMainNavMargin(): string {
  return root.value ? window.getComputedStyle(root.value).marginLeft : '0px';
}

function setMinNavMargin(val: string) {
  if(root.value) {
    root.value.style.marginLeft = val;
  }
}



defineExpose({ toggleNav });
</script>

<template>
  <section ref="root" :class="['drawer', right ? 'rtl' : 'ltr', modelValue ? 'open' : '']">
    <div class="h-screen sticky top-0 left-0 flex-col flex-wrap justify-start content-start items-start">
      <div data-drawer-header>
        <slot name="title">{{ $t(title) }}</slot>
      </div>
      <div data-drawer-body>
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<style scoped lang="postcss">
.drawer {
  @apply p-4 shadow-lg;
  position: absolute;
  top:60px;
  height: calc(100vh - 70px);
  bottom:0;
  min-width: 260px;
  max-width: 260px;
  background: var(--color-bg-content);
  border: 1px solid var(--color-secondary-light);
  border-right:0;
  opacity: 0;
}

.drawer.ltr {
  @apply rounded-r;
  margin-left: -260px;
}

.drawer.rtl {
  @apply rounded-l;
  margin-right: -260px;
}

.drawer.ltr.open {
  margin-left: 0;
  opacity: 1;
}

.drawer.rtl.open {
  margin-right: 0;
  opacity: 1;
}

.drawer.rtl {
  right: 0;
}

.drawer.ltr {
  transition: all 0.35s ease-in-out;
}

.drawer.rtl {
  transition: all 0.35s ease-in-out;
}

@media (max-width: 991.98px) {
  .sidebar.left {
    margin-left: -260px;
  }

  .sidebar.right {
    margin-right: -260px;
  }
}
</style>
