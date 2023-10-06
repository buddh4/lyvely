export class NotificationUpdateStateLiveEvent {
    constructor(uid, updatesAvailable) {
        this.name = NotificationUpdateStateLiveEvent.eventName;
        this.module = 'notifications';
        this.uid = uid;
        this.updatesAvailable = updatesAvailable;
    }
}
NotificationUpdateStateLiveEvent.eventName = 'notificationUpdateStateEvent';
