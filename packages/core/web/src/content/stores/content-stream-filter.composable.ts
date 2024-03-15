import { ref } from 'vue';
import { ContentRequestFilter } from '@lyvely/interface';

const filter = ref(new ContentRequestFilter());

export const useContentStreamFilter = () => {
  return {
    filter,
  };
};
