import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDao } from './abstract.dao';
import { ModelSaveEvent } from './dao.events';
import { Model, TObjectId } from './db.type';
import {
  createCoreTestingModule,
  EventTester,
  getObjectId,
  afterEachTest,
  afterAllTests,
} from '../testing/core-test.util';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';
import { Injectable } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import {
  BaseDocument,
  type BaseDocumentData,
  type IDocumentTransformation,
  type LeanDoc,
} from '@/core';
import { T } from 'vitest/dist/reporters-LLiOBu3g';

@Schema()
class TestEntityV1 {
  _id: TObjectId;

  id: string;

  @Prop()
  numberField: number;

  @Prop({ type: Number })
  version = 1;

  constructor(data: BaseDocumentData<TestEntityV1>) {
    BaseDocument.init(this, data);
  }
}

const TestEntityV1Schema = SchemaFactory.createForClass(TestEntityV1);

@Schema()
class TestEntity {
  _id: TObjectId;

  id: string;

  @Prop()
  valueField: number;

  @Prop({ type: Number })
  version = 2;

  constructor(data: BaseDocumentData<TestEntity>) {
    BaseDocument.init(this, data);
  }
}

const TestEntitySchema = SchemaFactory.createForClass(TestEntity);

@Injectable()
class TestEntityDao extends AbstractDao<TestEntity, TestEntityV1> {
  @InjectModel(TestEntity.name) protected model: Model<TestEntity>;

  getModelConstructor(model: LeanDoc<TestEntity>) {
    return TestEntity;
  }

  getModuleId(): string {
    return 'test';
  }
}

type TestEntityVersions = TestEntity | TestEntityV1;

class TestEntityV1ToV2Transformation
  implements IDocumentTransformation<TestEntityVersions, TestEntity, TestEntityV1>
{
  getId(): string {
    return TestEntityV1ToV2Transformation.name;
  }

  condition(leanDoc: LeanDoc<TestEntityVersions>): boolean {
    return leanDoc.version === 1;
  }

  transform(oldDoc: LeanDoc<TestEntityV1>): LeanDoc<TestEntity> {
    return new TestEntity({ valueField: oldDoc.numberField });
  }
}

const TEST_KEY = 'abstract_dao';

const TestEntityModelDefinition: ModelDefinition[] = [
  {
    name: TestEntity.name,
    collection: 'test',
    schema: TestEntitySchema,
  },
  {
    name: TestEntityV1.name,
    collection: 'test',
    schema: TestEntityV1Schema,
  },
];

describe('AbstractDao Transformations', () => {
  let testingModule: TestingModule;
  let dao: TestEntityDao;
  let ModelV1: Model<TestEntityV1>;
  let Model: Model<TestEntity>;

  beforeEach(async () => {
    testingModule = await createCoreTestingModule(
      TEST_KEY,
      [TestEntityDao, EventTester],
      TestEntityModelDefinition,
    ).compile();
    dao = testingModule.get(TestEntityDao);
    dao.registerTransformations(new TestEntityV1ToV2Transformation());
    ModelV1 = testingModule.get('TestEntityV1Model');
    Model = testingModule.get('TestEntityModel');
  });

  afterEach(async () => {
    await afterEachTest(TEST_KEY, testingModule);
  });

  afterAll(async () => {
    await afterAllTests();
  });

  describe('transform', () => {
    it('transform on load', async () => {
      const v1Model = await ModelV1.create(new TestEntityV1({ numberField: 3 }));
      const model = await dao.findById(v1Model._id);
      expect(model?.valueField).toEqual(3);
      expect(model?.version).toEqual(2);
      expect((<any>model)?.numberField).toBeUndefined();

      const reload = await Model.findById(model!._id);
      expect(reload?.valueField).toEqual(3);
      expect(reload?.version).toEqual(2);
      expect((<any>reload)?.numberField).toBeUndefined();
    });
  });
});
