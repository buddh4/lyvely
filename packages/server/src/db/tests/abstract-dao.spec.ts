import { expect } from '@jest/globals';
import { InjectModel, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseEntity } from "../base.entity";
import { Model, Document } from "mongoose";
import { AbstractDao } from "../abstract.dao";
import { TestingModule } from "@nestjs/testing";
import { createBasicTestingModule, getObjectId } from "../../test/utils/test.utils";
import { ModelDefinition } from "@nestjs/mongoose/dist/interfaces";
import { Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ModelSaveEvent } from "../dao.events";

@Schema()
class TestEntity extends BaseEntity<TestEntity> {

  @Prop({ type: String, required: true })
  requiredField: string;

  @Prop({ type: Number })
  numberField: number;
}

type TestEntityDocument = TestEntity & Document;
const TestEntitySchema = SchemaFactory.createForClass(TestEntity);

const TestEntityModelDefinition: ModelDefinition = {
  name: TestEntity.name,
  schema: TestEntitySchema,
}

@Injectable()
class TestEntityDao extends AbstractDao<TestEntity> {

  @InjectModel(TestEntity.name) protected model: Model<TestEntityDocument>;

  getModelConstructor() {
    return TestEntity;
  }

  getModuleId(): string {
    return "test";
  }
}

@Injectable()
class EventTester {
  @Inject()
  public eventEmitter: EventEmitter2;
}

const TEST_KEY = 'abstract_dao';

describe('AbstractDao', () => {
  let testingModule: TestingModule;
  let TestEntityModel: Model<TestEntityDocument>;
  let dao: TestEntityDao;
  let eventTester: EventTester;

  beforeEach(async () => {
    testingModule = await createBasicTestingModule(TEST_KEY, [TestEntityDao, EventTester], [TestEntityModelDefinition]).compile();
    TestEntityModel = testingModule.get<Model<TestEntityDocument>>('TestEntityModel');
    dao = testingModule.get<TestEntityDao>(TestEntityDao);
    eventTester = testingModule.get<EventTester>(EventTester);
  });

  it('should be defined', () => {
    expect(dao).toBeDefined();
    expect(eventTester).toBeDefined();
  });

  describe('save', () => {
    it('save valid entity', async () => {
      const model = new TestEntity({ requiredField: 'We need this...' });
      const entity = await dao.save(model);
      expect(entity).toBeDefined();
      expect(entity instanceof TestEntity).toEqual(true);
      expect(entity.requiredField).toEqual('We need this...');
      expect(entity._id).toBeDefined()
      expect(model._id).toEqual(entity._id);
      expect(model.id).toEqual(entity.id);
    });

    it('save invalid entity fails', async () => {
      try {
        await dao.save(new TestEntity({ numberField: 3 }));
        expect(true).toEqual(false);
      } catch (err) {
        if (err.name === 'ValidationError') {
          expect(err.errors['requiredField'].kind).toEqual('required');
        } else {
          expect(true).toEqual(false);
        }
      }
    });

    it('beforeSave is called', async () => {
      const model = new TestEntity({ requiredField: 'We need this...' });
      let wasCalled = false;
      eventTester.eventEmitter.on('model.testentity.save.pre', (evt: ModelSaveEvent<TestEntityDao, TestEntity>) => {
        expect(evt.model).toEqual(model);
        wasCalled = true;
      });
      await dao.save(model);
      expect(wasCalled).toEqual(true);
    });

    it('afterSave is called', async () => {
      const model = new TestEntity({ requiredField: 'We need this...' });
      let wasCalled = false;
      eventTester.eventEmitter.on('model.testentity.save.post', (evt: ModelSaveEvent<TestEntityDao, TestEntity>) => {
        expect(evt.model._id).toBeDefined();
        expect(evt.model.requiredField).toEqual('We need this...');
        wasCalled = true;
      });
      await dao.save(model);
      expect(wasCalled).toEqual(true);
    })

    describe('findById', () => {
      it('find existing entity by model', async () => {
        const model = new TestEntity({ requiredField: 'We need this...', numberField: 5 });
        await dao.save(model);
        const result = await dao.findById(model);
        expect(result).toBeDefined();
        expect(result instanceof TestEntity).toEqual(true);
        expect(result._id).toEqual(model._id);
        expect(result.requiredField).toEqual('We need this...');
        expect(result.numberField).toEqual(5);
      });

      it('find existing entity by id', async () => {
        const model = new TestEntity({ requiredField: 'We need this...' });
        await dao.save(model);
        const result = await dao.findById(model._id);
        expect(result).toBeDefined();
        expect(result instanceof TestEntity).toEqual(true);
        expect(result._id).toEqual(model._id);
        expect(result.requiredField).toEqual(model.requiredField);
      });

      it('find entity with projection', async () => {
        const model = new TestEntity({ requiredField: 'We need this...', numberField: 5 });
        await dao.save(model);
        const result = await dao.findById(model, { projection: { requiredField: 1 } });
        expect(result.requiredField).toEqual('We need this...');
        expect(result.numberField).toBeUndefined();
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
        const model3 = new TestEntity({ requiredField: '3'  });
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
        const model3 = new TestEntity({ requiredField: '3'  });
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
        const model3 = new TestEntity({ requiredField: '3', numberField: 100  });
        await dao.save(model);
        await dao.save(model2);
        await dao.save(model3);
        const result = await dao.findAllByIds([model, model2, model3], { sort: { numberField: 1 } });
        expect(result.length).toEqual(3);
        expect(result[0]._id).toEqual(model2._id);
        expect(result[1]._id).toEqual(model._id);
        expect(result[2]._id).toEqual(model3._id);
      });

      it('find entity with sort and projection', async () => {
        const model = new TestEntity({ requiredField: '1', numberField: 4 });
        const model2 = new TestEntity({ requiredField: '2', numberField: 2 });
        const model3 = new TestEntity({ requiredField: '3', numberField: 100  });
        await dao.save(model);
        await dao.save(model2);
        await dao.save(model3);
        const result = await dao.findAllByIds([model, model2, model3], { projection: { requiredField: 1 }, sort: { numberField: 1 } });
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
        const model3 = new TestEntity({ requiredField: '3', numberField: 100  });
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
        const model3 = new TestEntity({ requiredField: '3', numberField: 100  });
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
        const model3 = new TestEntity({ requiredField: '3', numberField: 100  });
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
        const model3 = new TestEntity({ requiredField: '3', numberField: 100  });
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
        expect(search.requiredField).toEqual('updated');
      });
    });

    describe('findOneAndUpdateByIdSet', () => {
      it('update single field', async () => {
        const model = new TestEntity({ requiredField: '1', numberField: 4 });
        await dao.save(model);

        const result = await dao.findOneAndSetById(model, { requiredField: 'updated' });
        expect(model.requiredField).toEqual('updated');
        expect(result.requiredField).toEqual('updated');
      });

      it('update single field and return old state with `new: false`', async () => {
        const model = new TestEntity({ requiredField: '1', numberField: 4 });
        await dao.save(model);

        const result = await dao.findOneAndSetById(model, { requiredField: 'updated' }, { new: false });
        expect(model.requiredField).toEqual('updated');
        expect(result.requiredField).toEqual('1');
      });

      it('update non existing entity', async () => {
        const result = await dao.findOneAndSetById(getObjectId('whatever'), { requiredField: 'updated' });
        expect(result).toBeNull();
      });

      it('upsert non existing entity', async () => {
        const result = await dao.findOneAndSetById(getObjectId('whatever'), { requiredField: 'upserted' }, { upsert: true });
        expect(result).toBeDefined();
        expect(result.requiredField).toEqual('upserted');
      });

      it('upsert non existing entity with new: false', async () => {
        const result = await dao.findOneAndSetById(getObjectId('whatever'), { requiredField: 'upserted' }, { upsert: true, new: false });
        expect(result).toBeNull();
      });

      it('update without apply update', async () => {
        const model = new TestEntity({ requiredField: '1', numberField: 4 });
        await dao.save(model);

        const result = await dao.findOneAndSetById(model, { requiredField: 'updated' }, { apply: false });
        expect(model.requiredField).toEqual('1');
        expect(result.requiredField).toEqual('updated');
      });
    });
  })
})

// TODO: Test validation functions
// TODO: Test defaults
// TODO: Test getter/setter
// TODO: Test virtuals etc..
