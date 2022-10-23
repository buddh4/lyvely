<script lang="ts" setup>
import { ref } from 'vue';

const displayName = ref('');
const description = ref('');
</script>

<template>
  <ly-content-panel>
    <div class="flex items-center mb-2 flex-row items-stretch">
      <div class="w-full relative">
        <ly-button class="absolute right-0.5 bottom-0.5 text-xs z-10">
          {{ $t('common.restore') }}
        </ly-button>
        <ly-input-text v-model="displayName" class="mb-0" label="profile.settings.user.displayName" />
      </div>
      <div class="ml-3 bg-highlight w-20 flex justify-center items-center rounded border border-divide cursor-pointer">
        <ly-user-avatar class="m-3" />
      </div>
    </div>

    <div class="w-full relative">
      <ly-input-textarea v-model="description" label="profile.settings.user.description" />
      <ly-button class="absolute right-2 bottom-2 text-xs">
        {{ $t('common.restore') }}
      </ly-button>
    </div>

    <div>
      <ly-button class="primary float-right">
        {{ $t('common.update') }}
      </ly-button>
    </div>
  </ly-content-panel>

  <ly-content-panel>
    <div>
      <ly-button class="danger float-right" :confirm="{ text: 'profile.settings.archive.confirm' }">
        {{ $t('profile.settings.user.archive') }}
      </ly-button>
    </div>
  </ly-content-panel>
</template>

<style scoped></style>
