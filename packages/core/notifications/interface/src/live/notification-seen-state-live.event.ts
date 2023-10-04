import { ILiveUserEvent } from '@lyvely/live-interface';

export class NotificationSeenStateLiveEvent implements ILiveUserEvent {
  static eventName = 'notificationSeenStateEvent';
  name = NotificationSeenStateLiveEvent.eventName;
  module = 'notifications';
  uid: string;
  nid: string;
  state: boolean;

  constructor(uid: string, nid: string, seen: boolean) {
    this.uid = uid;
    this.nid = nid;
    this.state = seen;
  }
}
