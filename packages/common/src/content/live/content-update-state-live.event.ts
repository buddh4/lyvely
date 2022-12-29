import { ILiveProfileEvent } from '@/live';

export interface IContentUpdateStateEventOptions {
  pid: string;
  updatesAvailable: boolean;
  cid?: string;
  streamSort?: number;
}

export class ContentUpdateStateLiveEvent implements ILiveProfileEvent {
  static eventName = 'contentUpdateStateEvent';
  name = ContentUpdateStateLiveEvent.eventName;
  module = 'content';
  pid: string;
  updatesAvailable: boolean;
  cid?: string;
  streamSort?: number;

  constructor(options: IContentUpdateStateEventOptions) {
    this.pid = options.pid;
    this.updatesAvailable = options.updatesAvailable;
    this.cid = options.cid;
    this.streamSort = options.streamSort;
  }
}
