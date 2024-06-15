import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDao } from './abstract.dao';
import { ModelSaveEvent } from './dao.events';
import { TObjectId } from '../interfaces';
import {
  createCoreTestingModule,
  EventTester,
  getObjectId,
  afterEachTest,
} from '../../testing/core-test.util';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';
import { TestingModule } from '@nestjs/testing';
import { BaseDocument, type BaseDocumentData } from '@/core';
import { Dao } from "./dao.decorator";

@Schema({ discriminatorKey: 'type' })
class TestEntity {
  _id: TObjectId;

  id: string;

  @Prop({ required: true })
  requiredField: string;

  @Prop()
  numberField: number;

  type: string;

  constructor(data: BaseDocumentData<TestEntity>) {
    BaseDocument.init(this, data);
  }
}

const TestEntitySchema = SchemaFactory.createForClass(TestEntity);

@Schema()
class SubTestEntity extends TestEntity {
  @Prop()
  specialField?: string;

  override type = SubTestEntity.name;

  constructor(data: BaseDocumentData<SubTestEntity>) {
    super(false);
    BaseDocument.init(this, data);
  }
}

const SubTestEntitySchema = SchemaFactory.createForClass(SubTestEntity);

@Dao(TestEntity, {
  discriminator: {
   [SubTestEntity.name]: SubTestEntity
  }
})
class TestEntityDao extends AbstractDao<TestEntity> {}

@Dao(SubTestEntity, {})
class SubTestEntityDao extends AbstractDao<SubTestEntity> {}

const TEST_KEY = 'abstract_dao';

const TestEntityModelDefinition: ModelDefinition = {
  name: TestEntity.name,
  schema: TestEntitySchema,
  discriminators: [{ name: SubTestEntity.name, schema: SubTestEntitySchema }],
};

describe('AbstractDao', () => {
  let testingModule: TestingModule;
  let dao: TestEntityDao;
  let subDao: SubTestEntityDao;
  let eventTester: EventTester;

  beforeEach(async () => {
    testingModule = await createCoreTestingModule(
      TEST_KEY,
      [TestEntityDao, SubTestEntityDao, EventTester],
      [TestEntityModelDefinition]
    ).compile();

    dao = testingModule.get(TestEntityDao);
    subDao = testingModule.get(SubTestEntityDao);
    eventTester = testingModule.get(EventTester);
  });

  afterEach(async () => {
    await afterEachTest(TEST_KEY, testingModule);
  });

  describe('Sub entity dao', () => {
    it('save sub entity', async () => {
      const model = new SubTestEntity({requiredField: 'We need this...', specialField: 'Special!'});
      const entity = await subDao.save(model);
      expect(entity).toBeDefined();
      expect(entity instanceof SubTestEntity).toEqual(true);
      expect(entity.requiredField).toEqual('We need this...');
      expect(entity.specialField).toEqual('Special!');
      expect(entity._id).toBeDefined();
      expect(model._id).toEqual(entity._id);
      expect(model.id).toEqual(entity.id);
    });

    it('load sub entity', async () => {
      const model = new SubTestEntity({requiredField: 'We need this...', specialField: 'Special!'});
      let entity = await subDao.save(model);
      entity = (await subDao.reload(entity))!;
      expect(entity).toBeDefined();
      expect(entity instanceof SubTestEntity).toEqual(true);
      expect(entity.requiredField).toEqual('We need this...');
      expect(entity.specialField).toEqual('Special!');
      expect(entity._id).toBeDefined();
      expect(model._id).toEqual(entity._id);
      expect(model.id).toEqual(entity.id);
    });
  })

  describe('save', () => {
    it('save valid entity', async () => {
      const model = new SubTestEntity({ requiredField: 'We need this...' });
      const entity = await dao.save(model);
      expect(entity).toBeDefined();
      expect(entity instanceof SubTestEntity).toEqual(true);
      expect(entity.requiredField).toEqual('We need this...');
      expect(entity._id).toBeDefined();
      expect(model._id).toEqual(entity._id);
      expect(model.id).toEqual(entity.id);
    });

    it('save discriminator value', async () => {
      const model = new SubTestEntity({
        requiredField: 'We need this...',
        specialField: 'specialValue',
      });
      const entity = await dao.save(model, { discriminator: SubTestEntity.name });
      expect(entity).toBeDefined();
      expect(entity instanceof SubTestEntity).toEqual(true);
      expect(entity.requiredField).toEqual('We need this...');
      expect((<SubTestEntity>entity).specialField).toEqual('specialValue');
      expect(entity._id).toBeDefined();
      expect(model._id).toEqual(entity._id);
      expect(model.id).toEqual(entity.id);
    });

    it('save invalid entity fails', async () => {
      expect.assertions(1);
      try {
        await dao.save(new TestEntity({ numberField: 3 }));
      } catch (e) {
        const err = <any>e;
        if (err.name === 'ValidationError') {
          expect(err.errors['requiredField'].kind).toEqual('required');
        }
      }
    });

    it('beforeSave is called', async () => {
      const model = new TestEntity({ requiredField: 'We need this...' });
      let wasCalled = false;
      eventTester.eventEmitter.on(
        'model.testentity.save.pre',
        (evt: ModelSaveEvent<TestEntityDao, TestEntity>) => {
          expect(evt.model).toEqual(model);
          wasCalled = true;
        }
      );
      await dao.save(model);
      expect(wasCalled).toEqual(true);
    });

    it('afterSave is called', async () => {
      const model = new TestEntity({ requiredField: 'We need this...' });
      let wasCalled = false;
      eventTester.eventEmitter.on(
        'model.testentity.save.post',
        (evt: ModelSaveEvent<TestEntityDao, TestEntity>) => {
          expect(evt.model._id).toBeDefined();
          expect(evt.model.requiredField).toEqual('We need this...');
          wasCalled = true;
        }
      );
      await dao.save(model);
      expect(wasCalled).toEqual(true);
    });

    describe('findById', () => {
      it('find existing entity by model', async () => {
        const model = new TestEntity({ requiredField: 'We need this...', numberField: 5 });
        await dao.save(model);
        const result = await dao.findById(model);
        expect(result).toBeDefined();
        expect(result instanceof TestEntity).toEqual(true);
        expect(result?._id).toEqual(model._id);
        expect(result?.requiredField).toEqual('We need this...');
        expect(result?.numberField).toEqual(5);
      });

      it('find existing entity by id', async () => {
        const model = new TestEntity({ requiredField: 'We need this...' });
        await dao.save(model);
        const result = await dao.findById(model._id);
        expect(result).toBeDefined();
        expect(result instanceof TestEntity).toEqual(true);
        expect(result?._id).toEqual(model._id);
        expect(result?.requiredField).toEqual(model.requiredField);
      });

      it('find entity with projection', async () => {
        const model = new TestEntity({ requiredField: 'We need this...', numberField: 5 });
        await dao.save(model);
        const result = await dao.findById(model, { projection: { requiredField: 1 } });
        expect(result?.requiredField).toEqual('We need this...');
        expect(result?.numberField).toBeUndefined();
      });

      it('find non existing entity', async () => {
        const result = await dao.findById(getObjectId('whatever'));
        expect(result).toBeNull();
      });
    });

    describe('findAllByIds', () => {
      it('find existing entities', async () => {
        const model = new TestEntity({ requiredField: '1' });
        const model2 = new TestEntity({ requiredField: '2' });
        const model3 = new TestEntity({ requiredField: '3' });
        await dao.save(model);
        await dao.save(model2);
        await dao.save(model3);
        const result = await dao.findAllByIds([model2, model3]);
        expect(result.length).toEqual(2);
        expect(result[0]._id).toEqual(model2._id);
        expect(result[1]._id).toEqual(model3._id);
      });

      it('find existing and non existing entities', async () => {
        const model = new TestEntity({ requiredField: '1' });
        const model2 = new TestEntity({ requiredField: '2' });
        const model3 = new TestEntity({ requiredField: '3' });
        await dao.save(model);
        await dao.save(model2);
        await dao.save(model3);
        const result = await dao.findAllByIds([model2, model3, getObjectId('whatever')]);
        expect(result.length).toEqual(2);
        expect(result[0]._id).toEqual(model2._id);
        expect(result[1]._id).toEqual(model3._id);
      });

      it('find entity with sort', async () => {
        const model = new TestEntity({ requiredField: '1', numberField: 4 });
        const model2 = new TestEntity({ requiredField: '2', numberField: 2 });
        const model3 = new TestEntity({ requiredField: '3', numberField: 100 });
        await dao.save(model);
        await dao.save(model2);
        await dao.save(model3);
        const result = await dao.findAllByIds([model, model2, model3], {
          sort: { numberField: 1 },
        });
        expect(result.length).toEqual(3);
        expect(result[0]._id).toEqual(model2._id);
        expect(result[1]._id).toEqual(model._id);
        expect(result[2]._id).toEqual(model3._id);
      });

      it('find entity with sort and projection', async () => {
        const model = new TestEntity({ requiredField: '1', numberField: 4 });
        const model2 = new TestEntity({ requiredField: '2', numberField: 2 });
        const model3 = new TestEntity({ requiredField: '3', numberField: 100 });
        await dao.save(model);
        await dao.save(model2);
        await dao.save(model3);
        const result = await dao.findAllByIds([model, model2, model3], {
          projection: { requiredField: 1 },
          sort: { numberField: 1 },
        });
        expect(result.length).toEqual(3);
        expect(result[0]._id).toEqual(model2._id);
        expect(result[1]._id).toEqual(model._id);
        expect(result[2]._id).toEqual(model3._id);

        expect(result[0].numberField).toBeUndefined();
        expect(result[1].numberField).toBeUndefined();
        expect(result[2].numberField).toBeUndefined();
      });
    });

    describe('findAll', () => {
      it('find all without filter', async () => {
        const model = new TestEntity({ requiredField: '1', numberField: 4 });
        const model2 = new TestEntity({ requiredField: '2', numberField: 2 });
        const model3 = new TestEntity({ requiredField: '3', numberField: 100 });
        await dao.save(model);
        await dao.save(model2);
        await dao.save(model3);
        const result = await dao.findAll({});
        expect(result.length).toEqual(3);
        expect(result[0] instanceof TestEntity).toEqual(true);
        expect(result[1] instanceof TestEntity).toEqual(true);
        expect(result[2] instanceof TestEntity).toEqual(true);
      });

      it('find all with sort', async () => {
        const model = new TestEntity({ requiredField: '1', numberField: 4 });
        const model2 = new TestEntity({ requiredField: '2', numberField: 2 });
        const model3 = new TestEntity({ requiredField: '3', numberField: 100 });
        await dao.save(model);
        await dao.save(model2);
        await dao.save(model3);
        const result = await dao.findAll({}, { sort: { numberField: 1 } });
        expect(result.length).toEqual(3);
        expect(result[0]._id).toEqual(model2._id);
        expect(result[1]._id).toEqual(model._id);
        expect(result[2]._id).toEqual(model3._id);
      });

      it('find all with excludeIds array', async () => {
        const model = new TestEntity({ requiredField: '1', numberField: 4 });
        const model2 = new TestEntity({ requiredField: '2', numberField: 2 });
        const model3 = new TestEntity({ requiredField: '3', numberField: 100 });
        await dao.save(model);
        await dao.save(model2);
        await dao.save(model3);
        const result = await dao.findAll({}, { excludeIds: [model, model3] });
        expect(result.length).toEqual(1);
        expect(result[0]._id).toEqual(model2._id);
      });

      it('find all with single excludeId', async () => {
        const model = new TestEntity({ requiredField: '1', numberField: 4 });
        const model2 = new TestEntity({ requiredField: '2', numberField: 2 });
        const model3 = new TestEntity({ requiredField: '3', numberField: 100 });
        await dao.save(model);
        await dao.save(model2);
        await dao.save(model3);
        const result = await dao.findAll({}, { excludeIds: model });
        expect(result.length).toEqual(2);
        expect(result[0]._id).toEqual(model2._id);
        expect(result[1]._id).toEqual(model3._id);
      });
    });

    describe('updateOneByIdSet', () => {
      it('update single field', async () => {
        const model = new TestEntity({ requiredField: '1', numberField: 4 });
        await dao.save(model);

        await dao.updateOneSetById(model, { requiredField: 'updated' });
        expect(model.requiredField).toEqual('updated');

        const search = await dao.reload(model);
        expect(search?.requiredField).toEqual('updated');
      });
    });

    it('update discriminator value', async () => {
      const model = new SubTestEntity({ requiredField: '1', specialField: 'updated' });
      await dao.save(model, { discriminator: SubTestEntity.name });
      await dao.updateOneSetById(
        model,
        { specialValue: 'updated' },
        { discriminator: SubTestEntity.name }
      );
      const search = (await dao.reload(model)) as SubTestEntity;
      expect(search.specialField).toEqual('updated');
    });

    describe('upsert', () => {
      it('upsert non existing entity', async () => {
        const model = await dao.upsert(
          { requiredField: 'upserted' },
          { requiredField: 'upserted', numberField: 5 }
        );
        expect(model instanceof TestEntity).toEqual(true);
        expect(model?._id).toBeDefined();
        expect(model?.requiredField).toEqual('upserted');
        expect(model?.numberField).toEqual(5);
      });

      it('upsert non existing entity with new = false', async () => {
        const model = await dao.upsert(
          { requiredField: 'upserted' },
          { requiredField: 'upserted', numberField: 5 },
          { new: false }
        );
        expect(model).toBeNull();
      });

      it('upsert existing entity', async () => {
        const model = await dao.save(new TestEntity({ requiredField: '1', numberField: 4 }));
        const upserted = await dao.upsert(
          { requiredField: '1' },
          { requiredField: 'upserted', numberField: 5 }
        );
        expect(upserted instanceof TestEntity).toEqual(true);
        expect(upserted?._id.equals(model._id)).toBeDefined();
        expect(upserted?.requiredField).toEqual('upserted');
        expect(upserted?.numberField).toEqual(5);
      });

      it('upsert existing entity with new = false', async () => {
        const model = await dao.save(new TestEntity({ requiredField: '1', numberField: 4 }));
        const upserted = await dao.upsert(
          { requiredField: '1' },
          { requiredField: 'upserted', numberField: 5 },
          { new: false }
        );
        expect(upserted instanceof TestEntity).toEqual(true);
        expect(upserted?._id.equals(model._id)).toBeDefined();
        expect(upserted?.requiredField).toEqual('1');
        expect(upserted?.numberField).toEqual(4);
      });
    });

    describe('findOneAndUpdateByIdSet', () => {
      it('update single field', async () => {
        const model = new TestEntity({ requiredField: '1', numberField: 4 });
        await dao.save(model);

        const result = await dao.findOneAndSetById(model, { requiredField: 'updated' });
        expect(model.requiredField).toEqual('updated');
        expect(result?.requiredField).toEqual('updated');
      });

      it('update single field and return old state with `new: false`', async () => {
        const model = new TestEntity({ requiredField: '1', numberField: 4 });
        await dao.save(model);

        const result = await dao.findOneAndSetById(
          model,
          { requiredField: 'updated' },
          { new: false }
        );
        expect(model.requiredField).toEqual('updated');
        expect(result?.requiredField).toEqual('1');
      });

      it('update non existing entity', async () => {
        const result = await dao.findOneAndSetById(getObjectId('whatever'), {
          requiredField: 'updated',
        });
        expect(result).toBeNull();
      });

      it('upsert non existing entity', async () => {
        const result = await dao.findOneAndSetById(
          getObjectId('whatever'),
          { requiredField: 'upserted' },
          { upsert: true }
        );
        expect(result).toBeDefined();
        expect(result?.requiredField).toEqual('upserted');
      });

      it('upsert non existing entity with new: false', async () => {
        const result = await dao.findOneAndSetById(
          getObjectId('whatever'),
          { requiredField: 'upserted' },
          { upsert: true, new: false }
        );
        expect(result).toBeNull();
      });

      it('update without apply update', async () => {
        const model = new TestEntity({ requiredField: '1', numberField: 4 });
        await dao.save(model);

        const result = await dao.findOneAndSetById(
          model,
          { requiredField: 'updated' },
          { apply: false }
        );
        expect(model.requiredField).toEqual('1');
        expect(result?.requiredField).toEqual('updated');
      });
    });
  });
});
