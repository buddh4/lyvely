export class NotificationSeenStateLiveEvent {
    constructor(uid, nid, seen) {
        this.name = NotificationSeenStateLiveEvent.eventName;
        this.module = 'notifications';
        this.uid = uid;
        this.nid = nid;
        this.state = seen;
    }
}
NotificationSeenStateLiveEvent.eventName = 'notificationSeenStateEvent';
