import { defineStore } from 'pinia';
import { ContentModel } from '@lyvely/common';
import { useContentService } from '@/modules/content/services/content.service';
import { useGlobalDialogStore } from '@/modules/core/store/global.dialog.store';

export const useContentStore = defineStore('content', () => {
  const contentService = useContentService();
  const globalDialog = useGlobalDialogStore();

  async function toggleArchive(content: ContentModel) {
    return content.meta.isArchived ? unarchive(content) : archive(content);
  }

  async function archive(content: ContentModel) {
    return contentService
      .archive(content.id)
      .then(() => (content.meta.isArchived = true))
      .catch(globalDialog.showUnknownError);
  }

  async function unarchive(content: ContentModel) {
    return contentService
      .unarchive(content.id)
      .then(() => (content.meta.isArchived = false))
      .catch(globalDialog.showUnknownError);
  }

  return {
    archive,
    unarchive,
    toggleArchive,
  };
});
