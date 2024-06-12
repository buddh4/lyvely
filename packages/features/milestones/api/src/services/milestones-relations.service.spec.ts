import {
  ProfileTestDataUtils,
  Content,
  ContentMetadata,
  ContentSchema,
  ContentType,
  ContentModel,
  DocumentIdentity,
  TObjectId,
  Model,
  buildContentTest,
} from '@lyvely/api';
import { getObjectId, ILyvelyTestingModule } from '@lyvely/api';
import { MilestonesRelationsService } from './milestones-relations.service';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { CalendarInterval, formatDate } from '@lyvely/dates';
import { MilestoneRelationModel } from '@lyvely/milestones-interface';
import { INestApplication, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MilestoneRelationEvent } from '../';
import { Milestone } from '../schemas';

@Schema()
class TestContent extends ContentType {
  toModel(): ContentModel {
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
        } as MilestoneRelationModel<TObjectId>;
      })
    );
  }

  reset() {
    this.event = undefined;
  }
}

describe('MileStonesRelationService', () => {
  let testingModule: ILyvelyTestingModule;
  let testData: ProfileTestDataUtils;
  let service: MilestonesRelationsService;
  let TestContentModel: Model<TestContent>;
  let app: INestApplication;
  let testProvider: TestMilestoneRelationProvider;

  const TEST_KEY = 'DataPointService';

  beforeEach(async () => {
    testingModule = await buildContentTest(TEST_KEY)
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
    const { profile, user, context } = await testData.createUserAndProfile();
    const mid = getObjectId(Date.now().toString());
    const doc = await new TestContentModel(
      new TestContent(context, {
        meta: new ContentMetadata(<ContentMetadata>{ mid }),
      })
    ).save();

    return {
      mid,
      profile,
      user,
      content: new TestContent(context, <any>doc.toJSON()),
      context,
    };
  };

  describe('getRelationsByMilestones()', () => {
    it('test event data', async () => {
      const { context, content, mid } = await createTestContent();
      await service.getRelationsByMilestones(context, [mid]);
      expect(testProvider?.event?.data).toBeDefined();
      expect(testProvider?.event?.data.contents.length).toEqual(1);
      expect(testProvider?.event?.data.contents[0]._id).toEqual(content._id);
      expect(formatDate(testProvider!.event!.data.date!)).toEqual(formatDate(new Date()));
    });

    it('test result', async () => {
      const { context, content, mid } = await createTestContent();
      const result = await service.getRelationsByMilestones(context, [
        mid as DocumentIdentity<Milestone>,
      ]);
      expect(result?.length).toEqual(1);
      expect(result![0].cid).toEqual(content._id);
      expect(result![0].title).toEqual('Test content');
      expect(result![0].contentType).toEqual(TestContent.name);
      expect(result![0].progress).toEqual(0.4);
    });
  });
});
