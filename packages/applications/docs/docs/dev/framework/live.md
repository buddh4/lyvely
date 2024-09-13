# Live

The Live module enables real-time UI updates using Server-Sent Events (SSE). While updates are performed through API 
calls, SSE allows clients to receive updates via long-running HTTP connections.

## Global Events

Global events are broadcasted to every active user on the platform. Here’s an example of how to emit a global event:

```typescript
@Injectable()
export class TestService {

  constructor(
    private readonly liveService: LiveService
  ) {
  }

  async sentTestEvent() {
    this.liveService.emitGlobalEvent({
      module: 'my-module',
      name: 'testEvent'
    });
  }
}
```

To listen for global events, subscribe as follows:

```typescript
const live = useLiveStore();
live.on('my-module', 'testEvent', (evt: ILiveEvent) => {
  // Handle event here
});
```
:::tip
You can include any custom fields in your event data for more flexibility.
:::

## User Events

User events target a specific user. Below is an example of sending a user-specific event:

```typescript
@Injectable()
export class TestService {

  constructor(
    private readonly liveService: LiveService
  ) {
  }

  async sentUserTestEvent(uid?: DocumentIdentity<User>) {
    this.liveService.emitUserEvent({
      module: 'my-module',
      name: 'testEvent',
      uid: assureStringId(uid)
    });
  }
}
```

To listen for user events, subscribe as follows:

```typescript
const live = useLiveStore();
live.on('my-module', 'testEvent', (evt: ILiveUserEvent) => {
  // Handle event here
});
```

## Profile Events

Profile events are sent to all subscribers of a specific profile. For example, the following code emits a test event to 
profile subscribers with the roles `Owner`, `Admin` or `Moderator`.

```typescript
@Injectable()
export class TestService {

  constructor(
    private readonly liveService: LiveService
  ) {
  }

  async sentProfileTestEvent(pid?: DocumentIdentity<Profile>) {
    this.liveService.emitProfileEvent({
      module: 'my-module',
      name: 'testEvent',
      pid: assureStringId(pid),
      roles: [ProfileMembershipRole.Owner, ProfileMembershipRole.Admin, ProfileMembershipRole.Moderator]
    });
  }
}
```

:::tip
The `roles` filter is optional. If omitted, the event will be sent to all subscribers of the profile.
:::

To subscribe to profile events, use the following code:

```typescript
const live = useLiveStore();
live.on('my-module', 'testEvent', (evt: ILiveProfileEvent) => {
  // Handle event here
});
```

## Content Events

For many use cases, you’ll want to synchronize content updates in your view. You can emit content update events using 
the `LiveService` as shown in the example below:

```typescript
@Injectable()
export class PollsService {

  constructor(
    private readonly pollsDao: PollsDao,
    private readonly liveService: LiveService
  ) {
  }

  async closePoll(context: ProtectedProfileContext, poll: Poll) {
    await this.pollsDao.closePoll(poll);
    this.liveService.emitProfileEvent(new ContentUpdateStateLiveEvent(poll.toModel()));
  }
}
```
In this example, a generic content update event is emitted. You can subscribe to content update events in a store or 
view as shown:

```typescript
const contentStore = useContentStore()
contentStore.onContentUpdated<Polls>(PollsModel.contentType, (content: Polls) => {
  // Update your store or view state here
});
```

## Custom Event Classes

For more complex use cases where additional data is needed, you can create custom event classes. Here’s an example:

```typescript
export class MyCustomLiveEvent implements ILiveProfileEvent {
  static eventName = 'customEvent';
  name = MyCustomLiveEvent.eventName;
  module = 'my-module';
  value: string;

  constructor(
    value: string,
  ) {
    this.value = value;
  }
}
```

With custom event classes, you can structure event data more precisely according to your needs.