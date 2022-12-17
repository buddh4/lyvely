import { ILiveUserEvent } from '@/live';

export class NewNotificationLiveEvent implements ILiveUserEvent {
  static eventName = 'newNotification';
  name = NewNotificationLiveEvent.eventName;
  module = 'notifications';
  uid: string;

  constructor(uid: string) {
    this.uid = uid;
  }
}
