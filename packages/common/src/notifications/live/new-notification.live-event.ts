import { ILiveUserEvent } from '@/live';

export class NewNotificationLiveEvent implements ILiveUserEvent {
  static eventName = 'newNotification';
  name = NewNotificationLiveEvent.eventName;
  module = 'notifications';
  data: undefined;
  uid: string;

  constructor(uid: string) {
    this.uid = uid;
  }
}
