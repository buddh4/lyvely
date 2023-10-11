import { ProfileTestDataUtils, profilesTestPlugin } from '@lyvely/core';
import { buildTest, getObjectId, LyvelyTestingModule } from '@lyvely/testing';
import {
  Content,
  ContentMetadata,
  ContentSchema,
  ContentType,
  ContentModel,
  contentTestPlugin,
} from '@lyvely/core';
import mongoose, { Model } from 'mongoose';
import { MilestonesRelationsService } from './milestones-relations.service';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@lyvely/core';
import { CalendarInterval, formatDate } from '@lyvely/dates';
import { MilestoneRelationModel } from '@lyvely/milestones-interface';
import { INestApplication, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MilestoneRelationEvent } from '../';
import { Milestone } from '../schemas';
import { EntityIdentity } from '@lyvely/core';

@Schema()
class TestContent extends ContentType<TestContent> {
  toModel(user?: User): ContentModel<TestContent> {
    return new ContentModel(this);
  }
}

const TestContentSchema = SchemaFactory.createForClass(TestContent);

const Models = [
  {
    name: Content.name,
    collection: Content.collectionName(),
    schema: ContentSchema,
    discriminators: [{ name: TestContent.name, schema: TestContentSchema }],
  },
];

@Injectable()
class TestMilestoneRelationProvider {
  event?: MilestoneRelationEvent;

  @OnEvent(MilestoneRelationEvent.getKeyByContentType(TestContent.name))
  handleOrderCreatedEvent(payload: MilestoneRelationEvent) {
    this.event = payload;
    payload.setResult(
      payload.data.contents.map((content) => {
        return {
          pid: content.pid,
          cid: content._id,
          mid: content.meta.mid,
          interval: CalendarInterval.Daily,
          contentType: TestContent.name,
          progress: 0.4,
          title: 'Test content',
        } as MilestoneRelationModel<mongoose.Types.ObjectId>;
      }),
    );
  }

  reset() {
    this.event = undefined;
  }
}

describe('MileStonesRelationService', () => {
  let testingModule: LyvelyTestingModule;
  let testData: ProfileTestDataUtils;
  let service: MilestonesRelationsService;
  let TestContentModel: Model<TestContent>;
  let app: INestApplication;
  let testProvider: TestMilestoneRelationProvider;

  const TEST_KEY = 'DataPointService';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([contentTestPlugin, profilesTestPlugin])
      .providers([MilestonesRelationsService, TestMilestoneRelationProvider])
      .models(Models)
      .compile();
    testData = testingModule.get(ProfileTestDataUtils);
    service = testingModule.get(MilestonesRelationsService);
    TestContentModel = testingModule.get('TestContentModel');
    testProvider = testingModule.get(TestMilestoneRelationProvider);
    app = testingModule.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await testingModule.afterEach();
    await app.close();
    testProvider.reset();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const createTestContent = async () => {
    const { profile, user } = await testData.createUserAndProfile();
    const mid = getObjectId(Date.now().toString());
    const doc = await new TestContentModel(
      new TestContent(profile, user, {
        meta: new ContentMetadata({ mid }),
      }),
    ).save();

    return { mid, profile, user, content: new TestContent(profile, user, <any>doc.toJSON()) };
  };

  describe('getRelationsByMilestones()', () => {
    it('test event data', async () => {
      const { profile, user, content, mid } = await createTestContent();
      await service.getRelationsByMilestones(profile, user, [mid as EntityIdentity<Milestone>]);
      expect(testProvider?.event?.data).toBeDefined();
      expect(testProvider?.event?.data.contents.length).toEqual(1);
      expect(testProvider?.event?.data.contents[0]._id).toEqual(content._id);
      expect(formatDate(testProvider!.event!.data.date!)).toEqual(formatDate(new Date()));
    });

    it('test result', async () => {
      const { profile, user, content, mid } = await createTestContent();
      const result = await service.getRelationsByMilestones(profile, user, [
        mid as EntityIdentity<Milestone>,
      ]);
      expect(result?.length).toEqual(1);
      expect(result![0].cid).toEqual(content._id);
      expect(result![0].title).toEqual('Test content');
      expect(result![0].contentType).toEqual(TestContent.name);
      expect(result![0].progress).toEqual(0.4);
    });
  });
});
