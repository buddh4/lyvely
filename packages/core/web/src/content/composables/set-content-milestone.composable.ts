import { useContentStore } from '@/content/stores/content.store';
import { ContentModel } from '@lyvely/interface';

export const useSetContentMilestone = (content: ContentModel) => {
  const contentStore = useContentStore();
  const { setMilestone } = contentStore;

  return {
    setMilestone: (mid: string) => setMilestone(content, mid),
  };
};
