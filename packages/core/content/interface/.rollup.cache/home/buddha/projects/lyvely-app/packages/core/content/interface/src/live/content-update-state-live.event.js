export class ContentUpdateStateLiveEvent {
    constructor(options) {
        this.name = ContentUpdateStateLiveEvent.eventName;
        this.module = 'content';
        this.pid = options.pid;
        this.updatesAvailable = options.updatesAvailable;
        this.cid = options.cid;
        this.parentId = options.parentId;
        this.streamSort = options.streamSort;
    }
}
ContentUpdateStateLiveEvent.eventName = 'contentUpdateStateEvent';
