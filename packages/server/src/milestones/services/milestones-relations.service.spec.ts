import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { createContentTestingModule, TestDataUtils } from '@/test';
import { Content, ContentMetadata, ContentSchema, ContentType } from '@/content';
import { Model } from 'mongoose';
import { MilestonesRelationsService } from '@/milestones/services/milestones-relations.service';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/users';
import { CalendarInterval, ContentModel, formatDate, MilestoneRelationModel } from '@lyvely/common';
import { INestApplication, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MilestoneRelationEvent } from '@/milestones';
import { Milestone } from '@/milestones/schemas';
import { ObjectID } from 'mongodb';
import { EntityIdentity } from '@/core';

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
  event: MilestoneRelationEvent;

  @OnEvent(MilestoneRelationEvent.getKeyByContentType(TestContent.name))
  handleOrderCreatedEvent(payload: MilestoneRelationEvent) {
    this.event = payload;
    payload.setResult(
      payload.data.contents.map((content) => {
        return {
          cid: content._id,
          interval: CalendarInterval.Daily,
          contentType: TestContent.name,
          progress: 0.4,
          title: 'Test content',
        } as MilestoneRelationModel;
      }),
    );
  }

  reset() {
    this.event = undefined;
  }
}

describe('MileStonesRelationService', () => {
  let testingModule: TestingModule;
  let testData: TestDataUtils;
  let service: MilestonesRelationsService;
  let TestContentModel: Model<TestContent>;
  let app: INestApplication;
  let testProvider: TestMilestoneRelationProvider;

  const TEST_KEY = 'DataPointService';

  beforeEach(async () => {
    testingModule = await createContentTestingModule(
      TEST_KEY,
      [MilestonesRelationsService, TestMilestoneRelationProvider],
      Models,
    ).compile();
    testData = testingModule.get(TestDataUtils);
    service = testingModule.get(MilestonesRelationsService);
    TestContentModel = testingModule.get('TestContentModel');
    testProvider = testingModule.get(TestMilestoneRelationProvider);
    app = testingModule.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
    await app.close();
    testProvider.reset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const createTestContent = async () => {
    const { profile, user } = await testData.createUserAndProfile();
    const mid = new ObjectID();
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
      await service.getRelationsByMilestones(profile, [mid as EntityIdentity<Milestone>]);
      expect(testProvider.event?.data).toBeDefined();
      expect(testProvider.event.data.contents.length).toEqual(1);
      expect(testProvider.event.data.contents[0]._id).toEqual(content._id);
      expect(formatDate(testProvider.event.data.date)).toEqual(formatDate(new Date()));
    });

    it('test result', async () => {
      const { profile, content, mid } = await createTestContent();
      const result = await service.getRelationsByMilestones(profile, [
        mid as EntityIdentity<Milestone>,
      ]);
      expect(result.length).toEqual(1);
      expect(result[0].cid).toEqual(content._id);
      expect(result[0].interval).toEqual(CalendarInterval.Daily);
      expect(result[0].title).toEqual('Test content');
      expect(result[0].contentType).toEqual(TestContent.name);
      expect(result[0].progress).toEqual(0.4);
    });
  });
});
