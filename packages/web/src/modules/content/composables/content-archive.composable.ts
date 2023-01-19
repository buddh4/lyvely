import { useContentStore } from '@/modules/content/stores/content.store';
import { computed } from 'vue';
import { ContentModel } from '@lyvely/common';

export const useContentArchive = (content: ContentModel) => {
  const contentStore = useContentStore();

  const { archive, unarchive, toggleArchive } = contentStore;
  const archiveLabel = computed(() =>
    content.meta.isArchived ? 'content.actions.restore' : 'content.actions.archive',
  );
  const archiveIcon = computed(() => (content.meta.isArchived ? 'unarchive' : 'archive'));

  return {
    archive: () => archive(content),
    unarchive: () => unarchive(content),
    toggleArchive: () => toggleArchive(content),
    archiveLabel,
    archiveIcon,
  };
};
