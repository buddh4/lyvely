import { defineStore } from 'pinia';
import { ContentModel, ContentUpdateResponse, IContent } from '@lyvely/interface';
import { useContentService } from '@/content/services/content.service';
import { useGlobalDialogStore, eventBus } from '@/core';
import { useProfileStore } from '@/profiles/stores/profile.store';

type ContentEventType = 'archived' | 'unarchived' | 'created' | 'updated' | 'set-milestone';

export const useContentStore = defineStore('content', () => {
  const contentService = useContentService();
  const globalDialog = useGlobalDialogStore();

  async function toggleArchive(content: ContentModel) {
    return content.meta.archived ? unarchive(content) : archive(content);
  }

  async function setMilestone(content: ContentModel, mid: string) {
    if (content.meta.mid === mid) return;
    return contentService
      .setMilestone(content.id, mid)
      .then(() => {
        content.meta.mid = mid;
        emitPostContentEvent(content.type, 'set-milestone', content);
        emitPostContentUpdateEvent(content.type, content);
      })
      .catch(globalDialog.showUnknownError);
  }

  async function archive(content: ContentModel) {
    return contentService
      .archive(content.id)
      .then(() => {
        content.meta.archived = true;
        emitPostContentEvent(content.type, 'archived', content);
        emitPostContentUpdateEvent(content.type, content);
      })
      .catch(globalDialog.showUnknownError);
  }

  async function unarchive(content: ContentModel) {
    return contentService
      .unarchive(content.id)
      .then(() => {
        content.meta.archived = false;
        emitPostContentEvent(content.type, 'unarchived', content);
        emitPostContentUpdateEvent(content.type, content);
      })
      .catch(globalDialog.showUnknownError);
  }

  function onContentEvent<T extends ContentModel = ContentModel>(
    type: '*' | string,
    event: ContentEventType,
    handler: (content: T) => void,
  ): void {
    return eventBus.on(`content.${type.toLowerCase()}.${event}.post`, handler!);
  }

  function offContentEvent<T extends ContentModel = ContentModel>(
    type: '*' | string,
    event: ContentEventType,
    handler: (content: T) => void,
  ): void {
    return eventBus.off(`content.${type.toLowerCase()}.${event}.post`, handler!);
  }

  function onContentCreated<T extends ContentModel = ContentModel>(
    type: '*' | string,
    handler: (content: T) => void,
  ): void {
    return onContentEvent(type, 'created', handler);
  }

  function offContentCreated<T extends ContentModel = ContentModel>(
    type: string,
    handler: (content: T) => void,
  ): void {
    return offContentEvent(type, 'created', handler);
  }

  function onContentUpdated<T extends ContentModel = ContentModel>(
    type: string,
    handler: (content: T) => void,
  ): void {
    return onContentEvent(type, 'updated', handler);
  }

  function offContentUpdated<T extends ContentModel = ContentModel>(
    type: string,
    handler: (content: T) => void,
  ): void {
    return offContentEvent(type, 'updated', handler);
  }

  function emitPostContentEvent(type: string, event: ContentEventType, content: IContent) {
    eventBus.emit(`content.${type.toLowerCase()}.${event}.post`, content);
  }

  function emitPostContentUpdateEvent(type: string, content: IContent) {
    emitPostContentEvent(type, 'updated', content);
  }

  function handleCreateContent(response?: ContentUpdateResponse<any>) {
    if (!response) return;
    useProfileStore().updateTags(response.tags);
    emitPostContentEvent(response.model.type, 'created', response.model);
  }

  function handleUpdateContent(response?: ContentUpdateResponse<any>) {
    if (!response) return;
    useProfileStore().updateTags(response.tags);
    emitPostContentUpdateEvent(response.model.type, response.model);
  }

  return {
    archive,
    unarchive,
    toggleArchive,
    handleCreateContent,
    handleUpdateContent,
    emitPostContentEvent,
    emitPostContentUpdateEvent,
    onContentCreated,
    offContentCreated,
    onContentUpdated,
    setMilestone,
    offContentUpdated,
  };
});
