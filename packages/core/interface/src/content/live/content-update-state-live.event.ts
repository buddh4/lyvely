import { ILiveProfileEvent } from '@/live/interfaces';
import { ContentModel } from '../models';

export interface IContentUpdateStateEventOptions {
  updatesAvailable: boolean;
}

export class ContentUpdateStateLiveEvent implements ILiveProfileEvent {
  static eventName = 'contentUpdateStateEvent';
  name = ContentUpdateStateLiveEvent.eventName;
  module = 'content';
  pid: string;
  updatesAvailable: boolean;
  cid?: string;
  parentId?: string;
  streamSort?: number;

  constructor(content: ContentModel, options: IContentUpdateStateEventOptions) {
    this.pid = content.pid;
    this.cid = content.id;
    this.parentId = content.meta.parentId;
    this.streamSort = content.meta.streamSort;
    this.updatesAvailable = options.updatesAvailable;
  }
}
