import type { PropertiesOf } from '@lyvely/common';
import { v4 as uuidV4 } from 'uuid';

export interface ILiveState {
  connectId: string;
  tabSubscriptions?: string[];
  topicSubscriptions?: string[];
}

export class LiveState {
  connectId: string = uuidV4();
  tabSubscriptions: Set<string> = new Set();
  topicSubscriptions: Set<string> = new Set();

  static buildGlobalSubId(topic: string) {
    return `global:${topic}`;
  }

  static buildUserSubId(topic: string) {
    return `user:${topic}`;
  }

  static buildProfileSubId(pid: string, topic?: string) {
    return ['profile', pid, topic].filter(Boolean).join(':');
  }

  static buildContentSubId(pid: string, cid: string, topic?: string) {
    return ['content', pid, cid, topic].filter(Boolean).join(':');
  }

  constructor(data?: ILiveState | PropertiesOf<LiveState>) {
    if (data?.tabSubscriptions) {
      this.tabSubscriptions = new Set(data.tabSubscriptions);
    }
    if (data?.topicSubscriptions) {
      this.topicSubscriptions = new Set(data.topicSubscriptions);
    }
    if (data?.connectId) {
      this.connectId = data.connectId;
    }
  }

  isSubscribedTo(subId: string) {
    return this.topicSubscriptions.has(subId);
  }

  addSubscription(tabId: string, subId: string) {
    this.tabSubscriptions.add(`${subId}:${tabId}`);
    this.topicSubscriptions.add(subId);
  }

  removeSubscription(tabId: string, subId: string) {
    this.tabSubscriptions.delete(`${subId}:${tabId}`);
    const tabSubscriptionArr = Array.from(this.tabSubscriptions);
    const stillSubscribed = tabSubscriptionArr.find((tabSubId) => tabSubId.startsWith(`${subId}:`));
    if (!stillSubscribed) {
      this.topicSubscriptions.delete(subId);
    }
  }

  toPlainObject(): ILiveState {
    return {
      connectId: this.connectId,
      tabSubscriptions: Array.from(this.tabSubscriptions),
      topicSubscriptions: Array.from(this.topicSubscriptions),
    };
  }
}
