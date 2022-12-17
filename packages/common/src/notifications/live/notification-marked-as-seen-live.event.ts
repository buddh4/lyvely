import { ILiveUserEvent } from '@/live';

export class NotificationMarkedAsSeenLiveEvent implements ILiveUserEvent {
  static eventName = 'notificationMarkedAsSeen';
  name = NotificationMarkedAsSeenLiveEvent.eventName;
  module = 'notifications';
  uid: string;
  nid: string;

  constructor(uid: string, nid: string) {
    this.uid = uid;
    this.nid = nid;
  }
}
