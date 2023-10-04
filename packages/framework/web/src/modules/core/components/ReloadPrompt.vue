<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';

const intervalMS = 60 * 60 * 1000;

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
  onRegisteredSW: (swUrl, r) => {
    r &&
      setInterval(async () => {
        if (!(!r.installing && navigator)) return;

        if ('connection' in navigator && !navigator.onLine) return;

        const resp = await fetch(swUrl, {
          cache: 'no-store',
          headers: {
            cache: 'no-store',
            'cache-control': 'no-cache',
          },
        });

        if (resp?.status === 200) await r.update();
      }, intervalMS);
  },
});

const close = async () => {
  offlineReady.value = false;
  needRefresh.value = false;
};
</script>

<template>
  <div
    v-if="needRefresh"
    class="fixed right-0 bottom-0 m-2 p-1 md:m-4 md:p-5 bg-main border border-divide rounded text-left shadow"
    style="z-index: 910"
    role="alert">
    <div class="mb-2 md:mb-3">
      <span v-if="offlineReady">{{ $t('offline.message') }}</span>
      <span v-else>{{ $t('updater.message') }}</span>
    </div>
    <div class="flex justify-center gap-1">
      <ly-button class="secondary" @click="close">
        {{ $t('common.close') }}
      </ly-button>
      <ly-button v-if="needRefresh" class="primary" @click="updateServiceWorker()">
        {{ $t('common.reload') }}
      </ly-button>
    </div>
  </div>
</template>

<style>
.pwa-toast .message {
  margin-bottom: 8px;
}
.pwa-toast button {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
}
</style>
