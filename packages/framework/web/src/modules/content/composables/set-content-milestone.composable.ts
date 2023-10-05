import { useContentStore } from '@/modules/content/stores/content.store';
import { ContentModel } from '@lyvely/content-interface';

export const useSetContentMilestone = (content: ContentModel) => {
  const contentStore = useContentStore();
  const { setMilestone } = contentStore;

  return {
    setMilestone: (mid: string) => setMilestone(content, mid),
  };
};
