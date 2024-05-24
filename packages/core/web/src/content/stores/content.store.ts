import { defineStore } from 'pinia';
import { ContentModel, ContentUpdateResponse, IContent, useContentClient } from '@lyvely/interface';
import { useGlobalDialogStore, useEventBus } from '@/core';
import { useProfileStore } from '@/profiles/stores/profile.store';

type ContentEventType = 'archived' | 'restored' | 'created' | 'updated' | 'set-milestone';

export const useContentStore = defineStore('content', () => {
  const contentClient = useContentClient();
  const globalDialog = useGlobalDialogStore();

  async function toggleArchive(content: ContentModel) {
    return content.meta.archived ? restore(content) : archive(content);
  }

  async function setMilestone(content: ContentModel, mid: string) {
    if (content.meta.mid === mid) return;
    return contentClient
      .setMilestone(content.id, mid)
      .then(() => {
        content.meta.mid = mid;
        emitPostContentEvent(content.type, 'set-milestone', content);
        emitPostContentUpdateEvent(content.type, content);
      })
      .catch(globalDialog.showUnknownError);
  }

  async function archive(content: ContentModel) {
    return contentClient
      .archive(content.id)
      .then(() => {
        content.meta.archived = true;
        emitPostContentEvent(content.type, 'archived', content);
        emitPostContentUpdateEvent(content.type, content);
      })
      .catch(globalDialog.showUnknownError);
  }

  async function restore(content: ContentModel) {
    return contentClient
      .restore(content.id)
      .then(() => {
        content.meta.archived = false;
        emitPostContentEvent(content.type, 'restored', content);
        emitPostContentUpdateEvent(content.type, content);
      })
      .catch(globalDialog.showUnknownError);
  }

  function onContentEvent<T extends ContentModel = ContentModel>(
    type: '*' | string,
    event: ContentEventType,
    handler: (content: T) => void,
  ): void {
    return useEventBus().on(`content.${type.toLowerCase()}.${event}.post`, handler!);
  }

  function offContentEvent<T extends ContentModel = ContentModel>(
    type: '*' | string,
    event: ContentEventType,
    handler: (content: T) => void,
  ): void {
    return useEventBus().off(`content.${type.toLowerCase()}.${event}.post`, handler!);
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

  function onContentRestored<T extends ContentModel = ContentModel>(
    type: string,
    handler: (content: T) => void,
  ): void {
    return onContentEvent(type, 'restored', handler);
  }

  function offContentRestored<T extends ContentModel = ContentModel>(
    type: string,
    handler: (content: T) => void,
  ): void {
    return offContentEvent(type, 'restored', handler);
  }

  function onContentArchived<T extends ContentModel = ContentModel>(
    type: string,
    handler: (content: T) => void,
  ): void {
    return onContentEvent(type, 'archived', handler);
  }

  function offContentArchived<T extends ContentModel = ContentModel>(
    type: string,
    handler: (content: T) => void,
  ): void {
    return offContentEvent(type, 'archived', handler);
  }

  function emitPostContentEvent(type: string, event: ContentEventType, content: IContent) {
    useEventBus().emit(`content.${type.toLowerCase()}.${event}.post`, content);
  }

  function emitPostContentUpdateEvent(type: string, content: IContent) {
    emitPostContentEvent(type, 'updated', content);
  }

  function emitPostContentCreateEvent(type: string, content: IContent) {
    emitPostContentEvent(type, 'created', content);
  }

  function handleCreateContent(response?: ContentUpdateResponse<any>) {
    if (!response) return;
    useProfileStore().updateTags(response.tags);
    emitPostContentCreateEvent(response.model.type, response.model);
  }

  function handleUpdateContent(response?: ContentUpdateResponse<any>) {
    if (!response) return;
    useProfileStore().updateTags(response.tags);
    emitPostContentUpdateEvent(response.model.type, response.model);
  }

  return {
    archive,
    restore,
    toggleArchive,
    handleCreateContent,
    handleUpdateContent,
    emitPostContentEvent,
    emitPostContentUpdateEvent,
    emitPostContentCreateEvent,
    onContentCreated,
    offContentCreated,
    onContentUpdated,
    setMilestone,
    offContentUpdated,
    onContentArchived,
    offContentArchived,
    onContentRestored,
    offContentRestored,
  };
});
