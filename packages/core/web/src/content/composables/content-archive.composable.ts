import { useContentStore } from '@/content/stores/content.store';
import { computed } from 'vue';
import { ContentModel } from '@lyvely/interface';

export const useContentArchive = (content: ContentModel) => {
  const contentStore = useContentStore();

  const { archive, restore, toggleArchive } = contentStore;
  const archiveLabel = computed(() =>
    content.meta.archived ? 'content.actions.restore' : 'content.actions.archive'
  );
  const archiveIcon = computed(() => (content.meta.archived ? 'restore' : 'archive'));

  return {
    archive: () => archive(content),
    restore: () => restore(content),
    toggleArchive: () => toggleArchive(content),
    archiveLabel,
    archiveIcon,
  };
};
