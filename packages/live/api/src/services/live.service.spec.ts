import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { TestDataUtils, createBasicTestingModule } from '@lyvely/testing';
import { LiveService } from '@lyvely/live';
import { assureStringId } from '@lyvely/core';
import { firstValueFrom } from 'rxjs';
import { ILiveProfileEvent, ILiveUserEvent } from '@lyvely/common';

describe('LiveService', () => {
  let testingModule: TestingModule;
  let liveService: LiveService;
  let testData: TestDataUtils;

  const TEST_KEY = 'LiveService';

  beforeEach(async () => {
    testingModule = await createBasicTestingModule(TEST_KEY).compile();
    liveService = testingModule.get(LiveService);
    testData = testingModule.get(TestDataUtils);
  });

  it('should be defined', () => {
    expect(liveService).toBeDefined();
  });

  describe('emitProfileEvent()', () => {
    it('user receives membership profile live event', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();

      const event: ILiveProfileEvent = {
        name: 'testEvent',
        pid: assureStringId(profile),
        module: 'test',
      };

      const memberPromise = firstValueFrom(await liveService.subscribeUser(member));
      const ownerPromise = firstValueFrom(await liveService.subscribeUser(owner));

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
          .subscribeUser(user)
          .then(firstValueFrom)
          .then((result) => {
            clearTimeout(timeout);
            res(result);
          });
      });

      liveService.emitProfileEvent(event);

      return expect(userPromise).rejects.toEqual('failed');
    });
  });

  describe('emitUserEvent()', () => {
    it('user receives user live event', async () => {
      expect.assertions(1);

      const user = await testData.createUser();

      const event: ILiveUserEvent = {
        name: 'testEvent',
        uid: assureStringId(user),
        module: 'test',
      };

      const eventPromise = firstValueFrom(await liveService.subscribeUser(user));

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
          .subscribeUser(anotherUser)
          .then(firstValueFrom)
          .then((result) => {
            clearTimeout(timeout);
            res(result);
          });
      });

      liveService.emitUserEvent(event);

      return expect(userPromise).rejects.toEqual('failed');
    });
  });
});
