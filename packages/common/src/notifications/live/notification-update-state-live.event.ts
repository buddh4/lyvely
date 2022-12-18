import { ILiveUserEvent } from '@/live';

export class NotificationUpdateStateLiveEvent implements ILiveUserEvent {
  static eventName = 'newNotification';
  name = NotificationUpdateStateLiveEvent.eventName;
  module = 'notifications';
  uid: string;
  updatesAvailable: boolean;

  constructor(uid: string, updatesAvailable: boolean) {
    this.uid = uid;
    this.updatesAvailable = updatesAvailable;
  }
}
