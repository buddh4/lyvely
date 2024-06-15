import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDao } from './abstract.dao';
import { TObjectId } from '../interfaces';
import { createCoreTestingModule, afterEachTest } from '../../testing/core-test.util';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';
import { type INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import {
  BaseDocument,
  type BaseDocumentData, Dao,
  DiscriminatorDocumentTransformer,
  DiscriminatorTransformation,
  IDocumentTransformation,
  type LeanDoc,
} from '@/core';

@Schema({ discriminatorKey: 'type' })
class TestEntity {
  @Prop()
  value: string;

  _id: TObjectId;

  id: string;

  type: string;

  constructor(data: BaseDocumentData<TestEntity>) {
    BaseDocument.init(this, data);
  }
}

const TestEntitySchema = SchemaFactory.createForClass(TestEntity);

@Schema()
class TestEntityA extends TestEntity {
  override type = TestEntityA.name;

  constructor(data: BaseDocumentData<TestEntityA>) {
    super(false);
    BaseDocument.init(this, data);
  }
}

const TestEntityASchema = SchemaFactory.createForClass(TestEntityA);

@Schema()
class TestEntityB extends TestEntity {
  override type = TestEntityB.name;

  constructor(data: BaseDocumentData<TestEntityB>) {
    super(false);
    BaseDocument.init(this, data);
  }
}

const TestEntityBSchema = SchemaFactory.createForClass(TestEntityB);

class TestEntityTransformer extends DiscriminatorDocumentTransformer<TestEntity> {
  override getDiscriminator(leanDoc: LeanDoc<any>): string {
    return leanDoc.type;
  }
}

@Dao(TestEntity, {
  discriminator: {
    [TestEntityA.name]: TestEntityA,
    [TestEntityB.name]: TestEntityB,
  }
})
class TestEntityDao extends AbstractDao<TestEntity> {
  protected modelName = TestEntity.name;
  override transformer = new TestEntityTransformer();
}

const TEST_KEY = 'abstract_dao';

const TestEntityModelDefinition: ModelDefinition = {
  name: TestEntity.name,
  schema: TestEntitySchema,
  discriminators: [
    { name: TestEntityA.name, schema: TestEntityASchema },
    { name: TestEntityB.name, schema: TestEntityBSchema },
  ],
};

describe('AbstractDao', () => {
  let testingModule: TestingModule;
  let dao: TestEntityDao;
  let app: INestApplication;

  beforeEach(async () => {
    testingModule = await createCoreTestingModule(
      TEST_KEY,
      [TestEntityDao],
      [TestEntityModelDefinition]
    ).compile();

    app = testingModule.createNestApplication();
    dao = testingModule.get(TestEntityDao);
  });

  afterEach(async () => {
    await app.close();
    await afterEachTest(TEST_KEY, testingModule);
  });

  describe('AbstractDao discriminator transformation', () => {
    it('Generic transformation is applied to all documents', async () => {
      class TestEntityTransformation implements IDocumentTransformation<TestEntity> {
        discriminator = TestEntityB.name;

        getId(): string {
          return 'GenericTestEntityTransformation';
        }

        transform(leanDoc: LeanDoc<TestEntity>): LeanDoc<TestEntity> {
          return {
            ...leanDoc,
            value: leanDoc.value.substring(1, leanDoc.value.length),
          };
        }

        condition(leanDoc: LeanDoc<TestEntity>): boolean {
          return leanDoc.value.startsWith('_');
        }
      }

      dao.registerTransformations(new TestEntityTransformation());

      await dao.saveMany([new TestEntityA({ value: '_a' }), new TestEntityB({ value: '_b' })]);

      const all = await dao.findAll({});
      expect(all[0] instanceof TestEntityA).toEqual(true);
      expect(all[0].value).toEqual('a');
      expect(all[1] instanceof TestEntityB).toEqual(true);
      expect(all[1].value).toEqual('b');
    });

    it('DiscriminatorTransformation is only applied on documents with the correct type', async () => {
      class TestEntityBTransformation extends DiscriminatorTransformation<TestEntityB> {
        discriminator = TestEntityB.name;

        override getId(): string {
          return 'TestEntityBTransformation';
        }

        override transform(leanDoc: LeanDoc<TestEntityB>): LeanDoc<TestEntityB> {
          return {
            ...leanDoc,
            value: leanDoc.value.substring(1, leanDoc.value.length),
          };
        }

        override typedCondition(leanDoc: LeanDoc<TestEntityB>): boolean {
          return leanDoc.value.startsWith('_');
        }

        override getDiscriminator(leanDoc: LeanDoc<TestEntityB>): string {
          return leanDoc.type;
        }
      }

      dao.registerTransformations(new TestEntityBTransformation());

      await dao.saveMany([new TestEntityA({ value: '_a' }), new TestEntityB({ value: '_b' })]);

      const all = await dao.findAll({});
      expect(all[0] instanceof TestEntityA).toEqual(true);
      expect(all[0].value).toEqual('_a');
      expect(all[1] instanceof TestEntityB).toEqual(true);
      expect(all[1].value).toEqual('b');
    });
  });
});
