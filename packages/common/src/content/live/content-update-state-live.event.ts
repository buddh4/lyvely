import { ILiveProfileEvent } from '@/live';

export class ContentUpdateStateLiveEvent implements ILiveProfileEvent {
  static eventName = 'contentUpdateStateEvent';
  name = ContentUpdateStateLiveEvent.eventName;
  module = 'content';
  pid: string;
  updatesAvailable: boolean;

  constructor(pid: string, updatesAvailable: boolean) {
    this.pid = pid;
    this.updatesAvailable = updatesAvailable;
  }
}
