import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDao } from './abstract.dao';
import { Model, TObjectId } from '../interfaces';
import {
  createCoreTestingModule,
  EventTester,
  afterEachTest,
} from '../../testing/core-test.util';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';
import { type INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import {
  BaseDocument,
  type BaseDocumentData, Dao,
  type IDocumentTransformation,
  type LeanDoc,
} from '@/core';

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

@Schema({ discriminatorKey: 'type' })
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

type TestEntityVersions = TestEntity | TestEntityV1;

@Dao(TestEntity)
class TestEntityDao extends AbstractDao<TestEntity, TestEntityVersions> {}

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
  let app: INestApplication;

  beforeEach(async () => {
    testingModule = await createCoreTestingModule(
      TEST_KEY,
      [TestEntityDao, EventTester],
      TestEntityModelDefinition
    ).compile();

    app = testingModule.createNestApplication();
    dao = testingModule.get(TestEntityDao);
    dao.registerTransformations(new TestEntityV1ToV2Transformation());
    ModelV1 = testingModule.get('TestEntityV1Model');
    Model = testingModule.get('TestEntityModel');
  });

  afterEach(async () => {
    await app.close();
    await afterEachTest(TEST_KEY, testingModule);
  });

  describe('transform', () => {
    it('transform on findById', async () => {
      const v1Model = await ModelV1.create(new TestEntityV1({ numberField: 3 }));
      const model = await dao.findById(v1Model._id);
      expect(model instanceof TestEntity).toEqual(true);
      expect(model?.valueField).toEqual(3);
      expect(model?.version).toEqual(2);
      expect((<any>model)?.numberField).toBeUndefined();

      const reload = await Model.findById(model!._id);
      expect(reload?.valueField).toEqual(3);
      expect(reload?.version).toEqual(2);
      expect((<any>reload)?.numberField).toBeUndefined();
    });

    it('transform on findAll', async () => {
      const v1Model = await ModelV1.create(new TestEntityV1({ numberField: 3 }));
      const v1Model2 = await ModelV1.create(new TestEntityV1({ numberField: 5 }));
      const models = await dao.findAll({}, { sort: { valueField: 1 } });
      expect(models[0].valueField).toEqual(3);
      expect(models[0].version).toEqual(2);
      expect(models[0]._id).toEqual(v1Model._id);
      expect((<any>models[0]).numberField).toBeUndefined();

      expect(models[1].valueField).toEqual(5);
      expect(models[1].version).toEqual(2);
      expect(models[1]._id).toEqual(v1Model2._id);
      expect((<any>models[1]).numberField).toBeUndefined();
    });
  });
});
