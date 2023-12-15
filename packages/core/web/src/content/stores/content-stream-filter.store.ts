import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ContentRequestFilter } from '@lyvely/interface';

export const useContentStreamFilterStore = defineStore('content-stream-filter', () => {
  const filter = ref(new ContentRequestFilter());

  return {
    filter,
  };
});
