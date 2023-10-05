import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ContentStreamFilter } from '@lyvely/content-interface';

export const useContentStreamFilterStore = defineStore('content-stream-filter', () => {
  const filter = ref(new ContentStreamFilter());

  return {
    filter,
  };
});
