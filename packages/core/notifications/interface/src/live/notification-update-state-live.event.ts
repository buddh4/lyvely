import { ILiveUserEvent } from '@lyvely/live-interface';

export class NotificationUpdateStateLiveEvent implements ILiveUserEvent {
  static eventName = 'notificationUpdateStateEvent';
  name = NotificationUpdateStateLiveEvent.eventName;
  module = 'notifications';
  uid: string;
  updatesAvailable: boolean;

  constructor(uid: string, updatesAvailable: boolean) {
    this.uid = uid;
    this.updatesAvailable = updatesAvailable;
  }
}
