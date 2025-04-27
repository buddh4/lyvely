import { ILyvelyTestingModule } from '@/testing';
import { buildProfileTest, ProfileTestDataUtils } from '@/profiles';
import { LiveService } from './live.service';
import {assureStringId, createObjectId} from '@/core';
import { firstValueFrom } from 'rxjs';
import { ILiveProfileEvent, ILiveUserEvent } from '@lyvely/interface';
import type { ILiveEvent } from "@lyvely/interface";
import { ProfileRoleLevel } from "@lyvely/interface";
import type {ILiveContentEvent} from "@lyvely/interface/src";
import {ProtectedProfileContentContext, TestContent} from "../../content";

describe('LiveService', () => {
  let testingModule: ILyvelyTestingModule;
  let liveService: LiveService;
  let testData: ProfileTestDataUtils;

  const TEST_KEY = 'LiveService';

  beforeEach(async () => {
    testingModule = await buildProfileTest(TEST_KEY).providers([LiveService]).compile();
    liveService = testingModule.get(LiveService);
    testData = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  describe("reconnect", () => {
    it('graceful disconnect', async () => {
      const connectId = 'testConnectId';
      const { member } = await testData.createSimpleGroup();
      await liveService.subscribeClient(member, connectId);
      liveService.disconnect(member, connectId);
      const event: ILiveUserEvent = {
        name: 'testEvent',
        uid: assureStringId(member),
        module: 'test',
      };
      liveService.emitUserEvent(event);
      const memberPromise = firstValueFrom(await liveService.subscribeClient(member, connectId));
      expect(await memberPromise).toEqual({ data: event });
    });
  })

  describe('addTopic()', () => {
    it('topics can be added after initial subscription', async () => {
      const { member } = await testData.createSimpleGroup();

      const memberPromise = firstValueFrom(await liveService.subscribeClient(member, "testConnectId"));
      liveService.subscribe("testConnectId",  { topic: 'test', visibility: 100 });

      const event: ILiveEvent = {
        name: 'test-event',
        module: 'test'
      }

      liveService.emit('test', event);

      expect(await memberPromise).toEqual({ data: event });
    });
  });

  describe('removeTopics()', () => {
    it('topics can be added after initial subscription', async () => {
      const { member } = await testData.createSimpleGroup();

      const memberPromise = liveService.subscribeClient(member, "testConnectId");

      liveService.subscribe("testConnectId", { topic: 'test', visibility: 100 });
      liveService.unsubscribe("testConnectId", 'test');

      const userPromise = new Promise((res, rej) => {
        const timeout = setTimeout(() => rej('failed'), 1000);
        memberPromise.then(firstValueFrom)
          .then((result) => {
            clearTimeout(timeout);
            res(result);
          });
      });

      liveService.emit('test', {
        name: 'test-event',
        module: 'test'
      });

      await expect(userPromise).rejects.toEqual('failed');
    });
  });

  describe('addUserSubscription()', () => {
    it('subscribe to user events with suffix', async () => {
      const { member, owner } = await testData.createSimpleGroup();

      const event: ILiveUserEvent = {
        name: 'testEvent',
        uid: assureStringId(member),
        module: 'test',
      };
      const memberPromise = firstValueFrom(await liveService.subscribeClient(member, "testConnectId"));
      await liveService.addUserSubscription(member,  "testConnectId","testSuffix");
      liveService.emitUserEvent(event, "testSuffix");
      expect(await memberPromise).toEqual({ data: event });
    })
  })

  describe('addProfileSubscription()', () => {
    it('subscribe to user events with suffix', async () => {
      const { member, profile, memberContext } = await testData.createSimpleGroup();

      const event: ILiveProfileEvent = {
        name: 'testEvent',
        pid: assureStringId(profile),
        module: 'test',
      };
      const memberPromise = firstValueFrom(await liveService.subscribeClient(member, "testConnectId"));
      await liveService.addProfileSubscription(memberContext, "testConnectId","testSuffix");
      liveService.emitProfileEvent(event, "testSuffix");
      expect(await memberPromise).toEqual({ data: event });
    })
  })

  describe('addContentSubscription()', () => {
    it('subscribe to user events with suffix', async () => {
      const { member, profile, memberContext } = await testData.createSimpleGroup();
      const cid = createObjectId()

      const event: ILiveContentEvent = {
        name: 'testEvent',
        pid: assureStringId(profile),
        cid: assureStringId(cid),
        module: 'test',
      };

      const contentContext = new ProtectedProfileContentContext({
        ...memberContext,
        content: new TestContent(memberContext, { _id: cid })
      })

      const memberPromise = firstValueFrom(await liveService.subscribeClient(member, "testConnectId",));
      await liveService.addContentSubscription(contentContext, "testConnectId","testSuffix");
      liveService.emitContentEvent(event, "testSuffix");
      expect(await memberPromise).toEqual({ data: event });
    })
  })

  describe('subscribeUser()', () => {
    describe('emitProfileEvent()', () => {
      it('user receives membership profile live event', async () => {
        const { owner, member, profile } = await testData.createSimpleGroup();

        const event: ILiveProfileEvent = {
          name: 'testEvent',
          pid: assureStringId(profile),
          module: 'test',
        };

        const memberPromise = firstValueFrom(await liveService.subscribeClient(member, "testConnectId",));
        const ownerPromise = firstValueFrom(await liveService.subscribeClient(owner, "testConnectId2",));

        liveService.emitProfileEvent(event);

        expect(await memberPromise).toEqual({ data: event });
        expect(await ownerPromise).toEqual({ data: event });
      });

      it('non member does not receive profile event', async () => {
        const { profile } = await testData.createSimpleGroup();
        const user = await testData.createUser();

        const event: ILiveProfileEvent = {
          name: 'testEvent',
          pid: assureStringId(profile),
          module: 'test',
        };

        const userPromise = new Promise((res, rej) => {
          const timeout = setTimeout(() => rej('failed'), 1000);
          liveService
            .subscribeClient(user, "testConnectId",)
            .then(firstValueFrom)
            .then((result) => {
              clearTimeout(timeout);
              res(result);
            });
        });

        liveService.emitProfileEvent(event);

        await expect(userPromise).rejects.toEqual('failed');
      });

      it('user role filter', async () => {
        const { owner, member, profile } = await testData.createSimpleGroup();

        const event: ILiveProfileEvent = {
          name: 'testEvent',
          pid: assureStringId(profile),
          visibility: ProfileRoleLevel.Admin,
          module: 'test',
        };

        const userPromise = new Promise((res, rej) => {
          const timeout = setTimeout(() => rej('failed'), 1000);
          liveService
            .subscribeClient(member, "testConnectId",)
            .then(firstValueFrom)
            .then((result) => {
              clearTimeout(timeout);
              res(result);
            });
        });

        const ownerPromise = firstValueFrom(await liveService.subscribeClient(owner, "testConnectId2",));

        liveService.emitProfileEvent(event);

        expect(await ownerPromise).toEqual({ data: event });
        await expect(userPromise).rejects.toEqual('failed');
      });
    })

    describe('emitUserEvent()', () => {
      it('user receives user live event', async () => {
        expect.assertions(1);

        const user = await testData.createUser();

        const event: ILiveUserEvent = {
          name: 'testEvent',
          uid: assureStringId(user),
          module: 'test',
        };

        const eventPromise = firstValueFrom(await liveService.subscribeClient(user, "testConnectId"));

        liveService.emitUserEvent(event);

        expect(await eventPromise).toEqual({ data: event });
      });

      it('another user does not receive user live event', async () => {
        expect.assertions(1);

        const user = await testData.createUser();
        const anotherUser = await testData.createUser('user2');

        const event: ILiveUserEvent = {
          name: 'testEvent',
          uid: assureStringId(user),
          module: 'test',
        };

        const userPromise = new Promise((res, rej) => {
          const timeout = setTimeout(() => rej('failed'), 1000);
          liveService
            .subscribeClient(anotherUser, "testConnectId",)
            .then(firstValueFrom)
            .then((result) => {
              clearTimeout(timeout);
              res(result);
            });
        });

        liveService.emitUserEvent(event);

        await expect(userPromise).rejects.toEqual('failed');
      });
    });
  });
});
