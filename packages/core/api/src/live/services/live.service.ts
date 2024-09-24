import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, switchMap, merge, filter, BehaviorSubject, EMPTY } from 'rxjs';
import { assureStringId, DocumentIdentity, OperationMode } from '@/core';
import { OptionalUser, User } from '@/users';
import {
  ILiveEvent,
  ILiveProfileEvent,
  ILiveUserEvent,
  ForbiddenServiceException,
  getProfileRelationRole,
  getProfileRoleLevel,
  getUserRole,
  getUserRoleLevelByRole,
  getContentUserRoleLevel,
} from '@lyvely/interface';
import {
  Profile,
  ProfileRelationsService,
  ProfilesService,
  ProfileVisibilityPolicy,
  ProtectedProfileContext,
} from '@/profiles';
import { InjectPolicy } from '@/policies';
import { LyvelyConfigService } from '@/config';
import { isNil, groupBy } from '@lyvely/common';
import { type ProtectedProfileContentContext } from '@/content/schemas';
import type { ILiveContentEvent } from '@lyvely/interface';

interface UserTopic {
  topic: string;
  visibility: number;
}

/**
 * A service responsible for managing subscription to live events and emitting those events.
 * The service handles the subscription and event emission logic for different scopes: global, user,
 * profile, and content.
 */
@Injectable()
export class LiveService {
  /**
   * A map that stores user topics, where the key is a user id and the value is another map.
   * This inner map maps topic identifiers to UserTopic objects for the corresponding user.
   *
   * The structure allows for the organization of topics by user and then by specific topic identifiers.
   */
  private userTopics: Map<string, Map<string, UserTopic>> = new Map();

  /**
   * A map storing a collection of BehaviorSubject objects keyed by a string.
   * Each key represents a unique user id, and the corresponding value is a BehaviorSubject
   * that holds an array of UserTopic objects.
   *
   * BehaviorSubjects are used to emit and observe the current value and any subsequent updates to the array of UserTopic objects.
   * This is useful for implementing reactive programming patterns where changes to user topics need to be tracked and reacted to automatically.
   *
   * Key:
   * - A string representing the user idc.
   *
   * Value:
   * - A BehaviorSubject instance that emits and holds an array of UserTopic objects.
   */
  private topicsSubjects: Map<string, BehaviorSubject<UserTopic[]>> = new Map();

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly configService: LyvelyConfigService,
    private profilesService: ProfilesService,
    private profileRelationsService: ProfileRelationsService,
    @InjectPolicy(ProfileVisibilityPolicy.name)
    private profileVisibilityPolicy: ProfileVisibilityPolicy
  ) {}

  /**
   * Emits a global event by constructing a global topic with an optional suffix
   * and invoking the emit method with the constructed topic and event.
   *
   * Users will automatically be subscribed to the global topic without a suffix.
   * The subscription of topics with suffix need to be manually  by the client.
   *
   * @param {ILiveEvent} event - The event to be emitted globally.
   * @param {string} [suffix] - An optional suffix to append to the global topic.
   * @return {boolean} Indicates whether the event was successfully emitted.
   */
  emitGlobalEvent(event: ILiveEvent, suffix?: string) {
    return this.emit(this.buildLiveGlobalTopic(suffix), event);
  }

  /**
   * Emits a profile level event by constructing a profile topic with an optional suffix
   * and invoking the emit method with the constructed topic and event.
   *
   * Profile members will automatically be subscribed to the profile topic without a suffix.
   * The subscription of topics with suffix need to be manually managed by the client.
   *
   * @param {ILiveProfileEvent} event - The event to be emitted.
   * @param {string} [suffix] - An optional suffix to append to the global topic.
   * @return {boolean} Indicates whether the event was successfully emitted.
   */
  emitProfileEvent(event: ILiveProfileEvent, suffix?: string) {
    return this.emit(this.buildLiveProfileTopic(event.pid, suffix), event);
  }

  /**
   * Emits a user level event, which is targeted to a single user by constructing a profile topic with an optional suffix
   * and invoking the emit method with the constructed topic and event.
   *
   * Users will automatically be subscribed to the user topic without a suffix.
   * The subscription of topics with suffix need to be manually managed by the client.
   *
   * @param {ILiveUserEvent} event - The event to be emitted.
   * @param {string} [suffix] - An optional suffix to append to the global topic.
   * @return {boolean} Indicates whether the event was successfully emitted.
   */
  emitUserEvent(event: ILiveUserEvent, suffix?: string) {
    return this.emit(this.buildLiveUserTopic(event.uid, suffix), event);
  }

  /**
   * Emits a content level event, which is targeted to a single user by constructing a profile topic with an optional suffix
   * and invoking the emit method with the constructed topic and event.
   *
   * This event type is used for content related updates, which are not directed to all profile subscribers, but rather
   * for specific views.
   *
   * The subscription of content related topics need to be manually managed by the client.
   *
   * @param {ILiveContentEvent} event - The event to be emitted.
   * @param {string} [suffix] - An optional suffix to append to the global topic.
   * @return {boolean} Indicates whether the event was successfully emitted.
   */
  emitContentEvent(event: ILiveContentEvent, suffix?: string) {
    return this.emit(this.buildLiveContentTopic(event.cid, suffix), event);
  }

  /**
   * Emits a custom live event to the specified topic.
   *
   * It is recommended to prefer the more specific emit functions as:
   *
   * - emitUserEvent
   * - emitProfileEvent
   * - emitGlobalEvent
   * - emitContentEvent
   *
   *
   * @param {string} topic - The topic to which the event should be emitted.
   * @param {ILiveEvent} event - The event object containing the details to be emitted.
   * @return {void}
   */
  emit(topic: string, event: ILiveEvent) {
    if (this.isStandaloneServer()) {
      this.eventEmitter.emit(topic, { data: event });
    } else {
      // TODO: redis publish
    }
  }

  /**
   * Subscribes the user or visitor to initial global live events or base profile live events as well as
   * user specific live events.
   *
   * @param user
   * @param pid
   */
  async subscribeUser(user: OptionalUser): Promise<Observable<ILiveEvent>> {
    // TODO: filter by visibility or permission
    // TODO: reconnect on visibility change
    if (!user) return this.subscribeVisitor();

    await this.initUserSubscriptions(user);

    const topicsSubject = this.topicsSubjects.get(assureStringId(user));
    if (!topicsSubject) {
      throw new Error('Topics subject not initialized correctly');
    }

    return topicsSubject.pipe(
      switchMap((userTopics) => {
        if (!userTopics) return EMPTY;
        return merge(
          ...userTopics.map(({ topic, visibility }) =>
            fromEvent(this.eventEmitter, topic).pipe(
              filter(
                ({ data: event }: any) => isNil(event.visibility) || event.visibility >= visibility
              )
            )
          )
        );
      })
    );
  }

  /**
   * Initializes user subscriptions based on their profile relations and roles.
   *
   * @param {OptionalUser} user - The user whose subscriptions are to be initialized.
   * @return {Promise<void>} A promise that resolves when the subscriptions have been initialized.
   */
  private async initUserSubscriptions(user: OptionalUser) {
    if (!user) return;

    const uid = assureStringId(user);
    const profileRelations = await this.profileRelationsService.findAllProfileRelationsByUser(user);
    const pids: string[] = Array.from(
      new Set(profileRelations.map((relation) => assureStringId(relation.pid)))
    );

    const relationsMap = groupBy(profileRelations, ({ pid }) => assureStringId(pid));

    const topics: UserTopic[] = [];

    pids.forEach((pid) => {
      const relations = relationsMap[pid];
      topics.push({
        topic: this.buildLiveProfileTopic(pid),
        // TODO: Note this will not include organization roles!
        visibility: getProfileRoleLevel(getProfileRelationRole(user, relations)),
      });
    });

    const userRoleLevel = getUserRoleLevelByRole(getUserRole(user));
    topics.push({ topic: this.buildLiveUserTopic(user), visibility: userRoleLevel });
    topics.push({ topic: this.buildLiveGlobalTopic(), visibility: userRoleLevel });

    this.subscribe(uid, ...topics);
  }

  /**
   * Adds a profile subscription based on the provided context and optional suffix.
   *
   * @param {ProtectedProfileContext} context - The context containing user and profile information.
   * @param {string} [suffix] - An optional suffix to be added to the profile topic.
   * @return {Promise<void>} A promise that resolves when the subscription has been successfully added.
   * @throws {ForbiddenServiceException} Throws a ForbiddenServiceException if the profile visibility policy verification fails.
   */
  async addProfileSubscription(context: ProtectedProfileContext, suffix?: string) {
    const { user, profile } = context;

    if (!(await this.profileVisibilityPolicy.verify(context))) {
      throw new ForbiddenServiceException();
    }

    this.subscribe(user, {
      topic: this.buildLiveProfileTopic(profile, suffix),
      visibility: context.getRoleLevel(),
    });
  }

  /**
   * Adds a global subscription for a user by constructing a topic
   * with an optional suffix and setting visibility based on user role.
   *
   * @param {User} user - The user who will be subscribed to the global topic.
   * @param {string} [suffix] - An optional suffix for the global topic.
   * @return {Promise<void>} A promise that resolves when the subscription is added.
   */
  async addGlobalSubscription(user: User, suffix?: string) {
    this.subscribe(user, {
      topic: this.buildLiveGlobalTopic(suffix),
      visibility: getUserRoleLevelByRole(getUserRole(user)),
    });
  }

  /**
   * Subscribes a user to a particular content topic with a specified visibility level.
   *
   * @param {ProtectedProfileContentContext} context - The context containing user and content information.
   * @param {string} [suffix] - An optional string to append to the topic.
   * @return {Promise<void>} A promise that resolves when the subscription is successfully added.
   */
  async addContentSubscription(context: ProtectedProfileContentContext, suffix?: string) {
    const { user, content } = context;

    this.subscribe(user, {
      topic: this.buildLiveContentTopic(content, suffix),
      visibility: getContentUserRoleLevel(context.getContentRole()),
    });
  }

  /**
   * Subscribes a user to a particular user topic with a specified visibility level.
   *
   * @param {ProtectedProfileContentContext} context - The context containing user and content information.
   * @param {string} [suffix] - An optional string to append to the topic.
   * @return {Promise<void>} A promise that resolves when the subscription is successfully added.
   */
  async addUserSubscription(user: User, suffix?: string) {
    this.subscribe(user, {
      topic: this.buildLiveUserTopic(user, suffix),
      visibility: getUserRoleLevelByRole(getUserRole(user)),
    });
  }

  /**
   * Subscribes the user to the given topics.
   *
   * @param {DocumentIdentity<User>} uid - The unique identifier of the user.
   * @param {...UserTopic} newTopics - The new topics to be added to the user's topics.
   * @return {void} This method does not return a value.
   */
  subscribe(uid: DocumentIdentity<User>, ...newTopics: UserTopic[]) {
    if (!newTopics.length) return;

    uid = assureStringId(uid);
    const topics = this.userTopics.get(uid) || new Map<string, UserTopic>();
    newTopics.forEach(({ topic, visibility }) => topics.set(topic, { topic, visibility }));
    this.userTopics.set(uid, topics);

    if (!this.topicsSubjects.has(uid)) {
      this.topicsSubjects.set(uid, new BehaviorSubject<UserTopic[]>(Array.from(topics.values())));
    } else {
      this.topicsSubjects.get(uid)!.next(Array.from(topics.values()));
    }
  }

  /**
   * Unsubscribes a user from the specified topics.
   *
   * @param tag uid - The unique identifier of the user.
   * @param tag topicsToRemove - An array of topics from which the user will be unsubscribed.
   * @return tag void
   */
  unsubscribe(uid: DocumentIdentity<User>, ...topicsToRemove: string[]) {
    uid = assureStringId(uid);
    const topics = this.userTopics.get(uid);
    if (!topics) return;

    topicsToRemove.forEach((topic) => topics.delete(topic));

    if (this.topicsSubjects.has(uid)) {
      this.topicsSubjects.get(uid)!.next(Array.from(topics.values()));
    }
  }

  /**
   * Subscribes a visitor to various event sources and merges them into a single observable stream.
   *
   * @return {Promise<Observable<any>>} A promise that resolves to an observable which emits events from the subscribed sources.
   */
  private async subscribeVisitor(): Promise<Observable<any>> {
    const observables = new Set<Observable<any>>();
    observables.add(fromEvent(this.eventEmitter, this.buildLiveGlobalTopic()));
    return merge(...observables);
  }

  /**
   * Constructs the live profile topic string based on the provided profile ID.
   *
   * @param {DocumentIdentity<Profile>} pid - The profile ID to be used in the topic string.
   * @param {string} [suffix] - An optional suffix to be appended to the topic string.
   * @return {string} The constructed live profile topic string.
   */
  private buildLiveProfileTopic(pid: DocumentIdentity<Profile>, suffix?: string): string {
    const topic = `live.profile.${assureStringId(pid)}`;
    return suffix ? topic + `.${suffix}` : topic;
  }

  /**
   * Constructs a live content topic string based on the provided document identifier and an optional suffix.
   *
   * @param {DocumentIdentity<any>} cid - The document identifier used to generate the topic string.
   * @param {string} [suffix] - An optional suffix to append to the topic string.
   * @return {string} The constructed live content topic string.
   */
  private buildLiveContentTopic(cid: DocumentIdentity<any>, suffix?: string): string {
    const topic = `live.content.${assureStringId(cid)}`;
    return suffix ? topic + `.${suffix}` : topic;
  }

  /**
   * Constructs a live user topic string.
   *
   * @param {DocumentIdentity<User>} uid - The unique identifier for the user.
   * @param {string} [suffix] - An optional suffix to append to the topic.
   * @return {string} The constructed topic string.
   */
  private buildLiveUserTopic(uid: DocumentIdentity<User>, suffix?: string) {
    const topic = `live.user.${assureStringId(uid)}`;
    return suffix ? topic + `.${suffix}` : topic;
  }

  /**
   * Constructs a live global topic string. If a suffix is provided,
   * it appends the suffix to the base topic 'live.global.'.
   *
   * @param {string} [suffix] - Optional suffix to be appended to the base topic.
   * @return {string} Constructed live global topic string.
   */
  private buildLiveGlobalTopic(suffix?: string) {
    return suffix ? `live.global.${suffix}` : `live.global`;
  }

  /**
   * Determines if the current server is running in standalone mode.
   *
   * @return {boolean} True if the server is operating in standalone mode, otherwise false.
   */
  private isStandaloneServer() {
    return (
      this.configService.get('operationMode', OperationMode.STANDALONE) === OperationMode.STANDALONE
    );
  }
}
